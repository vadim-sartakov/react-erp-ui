import group,
{
  extractGroupValues,
  buildGroupsTree,
  fillGroupsTree,
  reduceGroups
} from './';

describe('group', () => {

  describe('extractGroupValues', () => {

    const value = [
      { string: '1', boolean: true, number: 1 },
      { string: '2', boolean: false, number: 2 },
      { string: '1', boolean: true, number: 3 },
      { string: '1', boolean: false, number: 4 },
      { string: '2', boolean: true, number: 4 }
    ];

    it('should extract default (defined as string\'s) group values', () => {
      const groups = ['string', 'boolean', 'number']
      const result = extractGroupValues(value, groups);
      expect(result).toEqual([
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2, 3, 4] }
      ]);
    });

    it('should extract group values when custom comparator provided', () => {
      const groups = [
        {
          'string': { comparator: (a, b) => a === b }
        },
        'boolean',
        'number']
      const result = extractGroupValues(value, groups);
      expect(result).toEqual([
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2, 3, 4] }
      ]);
    });

  });

  describe('buildGroupsTree', () => {
    it('should build groups tree', () => {
      const groupValues = [
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2] }
      ];
      const result = buildGroupsTree(groupValues);
      expect(result).toEqual([
        {
          string: '1',
          children: [
            { boolean: true, children: [{ number: 1 }, { number: 2 }] },
            { boolean: false, children: [{ number: 1 }, { number: 2 }] }
          ]
        },
        {
          string: '2',
          children: [
            { boolean: true, children: [{ number: 1 }, { number: 2 }] },
            { boolean: false, children: [{ number: 1 }, { number: 2 }] }
          ]
        }
      ]);
    });
  });

  describe('fillGroupsTree', () => {
    it('should fill groups tree', () => {
      const array = [
        { string: '1', boolean: true, number: 1 },
        { string: '2', boolean: false, number: 2 },
        { string: '1', boolean: true, number: 3 },
        { string: '1', boolean: false, number: 4 },
        { string: '2', boolean: true, number: 4 }
      ];
      const groupsTree = [
        {
          string: '1',
          children: [
            { boolean: true },
            { boolean: false }
          ]
        },
        {
          string: '2',
          children: [
            { boolean: true },
            { boolean: false }
          ]
        }
      ];
      const groups = ['string', { 'boolean': { comparator: (a, b) => a === b } }];
      const result = fillGroupsTree(array, groupsTree, groups);
      expect(result).toEqual([
        {
          string: '1',
          children: [
            {
              boolean: true,
              children: [
                { string: '1', boolean: true, number: 1 },
                { string: '1', boolean: true, number: 3 }
              ]
            },
            {
              boolean: false,
              children: [
                { string: '1', boolean: false, number: 4 }
              ]
            }
          ]
        },
        {
          string: '2',
          children: [
            {
              boolean: true,
              children: [
                { string: '2', boolean: true, number: 4 }
              ]
            },
            {
              boolean: false,
              children: [
                { string: '2', boolean: false, number: 2 }
              ]
            }
          ]
        }
      ]);
    });
  });
  
  describe('reduceGroups', () => {
    it('should reduce groups', () => {
      const tree = [
        {
          string: '1',
          children: [
            {
              boolean: true,
              children: [
                { string: '1', boolean: true, number: 1 },
                { string: '1', boolean: true, number: 3 }
              ]
            },
            {
              boolean: false,
              children: [
                { string: '1', boolean: false, number: 4 }
              ]
            }
          ]
        },
        {
          string: '2',
          children: [
            {
              boolean: true,
              children: [
                { string: '2', boolean: true, number: 4 }
              ]
            },
            {
              boolean: false,
              children: [
                { string: '2', boolean: false, number: 2 }
              ]
            }
          ]
        }
      ];
      const groups = [{
        string: {
          reducer: (prev, cur) => ({ ...prev, number: prev.number + cur.number }),
          initialReducerValue: value => ({ ...value, number: 0 })
        }
      }];
      const result = reduceGroups(tree, groups);
      expect(result).toEqual([
        {
          string: '1',
          number: 8,
          children: [
            {
              boolean: true,
              number: 4,
              children: [
                { string: '1', boolean: true, number: 1 },
                { string: '1', boolean: true, number: 3 }
              ]
            },
            {
              boolean: false,
              number: 4,
              children: [
                { string: '1', boolean: false, number: 4 }
              ]
            }
          ]
        },
        {
          string: '2',
          number: 6,
          children: [
            {
              boolean: true,
              children: [
                { string: '2', boolean: true, number: 4 }
              ]
            },
            {
              boolean: false,
              number: 2,
              children: [
                { string: '2', boolean: false, number: 2 }
              ]
            }
          ]
        }
      ]);
    });
  });

});