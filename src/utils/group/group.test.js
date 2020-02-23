import group, { extractGroupValues, buildGroupsTree, fillGroupsTree } from './';

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
  
  it.skip('should group flat array', () => {
    const value = [
      { string: '1', boolean: true, number: 1 },
      { string: '2', boolean: false, number: 2 },
      { string: '1', boolean: true, number: 3 },
      { string: '1', boolean: false, number: 4 },
      { string: '2', boolean: true, number: 5 }
    ];
    const reduceStringGroup = (value, allValues) => {
      const total = allValues.reduce((acc, curValue) => acc + curValue.number, 0);
      return { string: value.string, total };
    };
    const reduceBooleanGroup = (value, allValues) => {
      const total = allValues.reduce((acc, curValue) => acc + curValue.number, 0);
      return { boolean: value.boolean, total };
    };
    const groups = [
      { string: { reduce: reduceStringGroup } },
      { boolean: { reduce: reduceBooleanGroup } }
    ];
    const result = group(value, groups);
    expect(result).toEqual([
      {
        string: '1',
        total: 8,
        children: [
          {
            boolean: true,
            total: 4,
            children: [
              { string: '1', number: 1 },
              { string: '1', number: 3 }
            ]
          },
          {
            boolean: false,
            total: 4,
            children: [
              { string: '1', number: 4 }
            ]
          }
        ]
      },
      {
        string: '2',
        total: 7,
        children: [
          {
            boolean: false,
            total: 2,
            children: [
              { string: '2', number: 2 }
            ]
          },
          {
            boolean: true,
            total: 5,
            children: [
              { string: '2', number: 5 }
            ]
          }
        ]
      }
    ]);
  });

});