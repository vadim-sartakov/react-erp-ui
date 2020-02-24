import group,
{
  buildTree,
  extractGroupValues,
  buildGroupsTree,
  fillGroupsTree,
  reduceGroups
} from './';

describe('group', () => {

  describe('buildTree', () => {
    it('should build tree with default params', () => {
      const array = [
        { id: 0, name: '1' },
        { id: 1, name: '1.1', parent: 0 },
        { id: 2, name: '1.1.1', parent: 1 },
        { id: 3, name: '1.2', parent: 0 },
        { id: 4, name: '2' },
        { id: 5, name: '2.1', parent: 4 },
        { id: 6, name: '3' }
      ];
      const result = buildTree(array);
      expect(result).toEqual([
        {
          id: 0,
          name: '1',
          children: [
            { id: 1, name: '1.1', parent: 0, children: [{ id: 2, name: '1.1.1', parent: 1 }] },
            { id: 3, name: '1.2', parent: 0 },
          ]
        },
        { id: 4, name: '2', children: [{ id: 5, name: '2.1', parent: 4 }] },
        { id: 6, name: '3' }
      ]);
    });
  });

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

    it('should extract default group values when grouped on object', () => {
      const value = [
        { number: 1, object: { id: 0 } },
        { number: 2, object: { id: 1 } },
        { number: 3, object: { id: 2 } },
        { number: 4, object: { id: 1 } },
        { number: 4, object: { id: 2 } }
      ];

      const groups = [{ 'object': { comparator: (a, b) => a.id === b.id } }];
      const result = extractGroupValues(value, groups);
      expect(result).toEqual([
        { object: [{ id: 0 } , { id: 1 }, { id: 2 }] },
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

    it('should build hierarchical groups tree', () => {
      const groupValues = [
        {
          object: [
            { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
            { id: '2', children: [{ id: '2.1' }] }
          ]
        },
        { boolean: [true, false] }
      ];
      const result = buildGroupsTree(groupValues);
      expect(result).toEqual([
        {
          object: { id: '1' },
          children: [
            {
              object: { id: '1.1' },
              children: [
                {
                  object: { id: '1.1.1' },
                  children: [{ boolean: true }, { boolean: false }]
                }
              ]
            }
          ]
        },
        {
          object: { id: '2' },
          children: [
            {
              object: { id: '2.1' },
              children: [{ boolean: true }, { boolean: false }]
            }
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
    it('should reduce groups with custom reducers and initial values', () => {
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
      const reducer = (prev, cur) => ({ ...prev, number: prev.number + cur.number });
      const initialReducerValue = value => ({ ...value, number: 0 });
      const groups = [
        { string: { reducer, initialReducerValue } },
        { boolean: { reducer, initialReducerValue } }
      ];
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
              number: 4,
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