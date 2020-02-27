import group,
{
  buildTree,
  extractGroupValues,
  buildGroupsTree,
  fillGroupsTree,
  reduceGroups
} from './';

const reducer = (prev, cur) => ({ ...prev, number: prev.number + cur.number });
const initialReducerValue = value => ({ ...value, number: 0 });

describe('group', () => {

  describe('buildTree', () => {
    it('should build tree with default params', async () => {
      const array = [
        { id: 0, name: '1' },
        { id: 1, name: '1.1', parent: 0 },
        { id: 2, name: '1.1.1', parent: 1 },
        { id: 3, name: '1.2', parent: 0 },
        { id: 4, name: '2' },
        { id: 5, name: '2.1', parent: 4 },
        { id: 6, name: '3' }
      ];
      const result = await buildTree(array);
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

    it('should extract default (defined as string\'s) group values', async () => {
      const groups = ['string', 'boolean', 'number']
      const result = await extractGroupValues(value, groups);
      expect(result).toEqual([
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2, 3, 4] }
      ]);
    });

    it('should extract group values when custom comparator provided', async () => {
      const groups = [
        {
          'string': { comparator: (a, b) => a === b }
        },
        'boolean',
        'number']
      const result = await extractGroupValues(value, groups);
      expect(result).toEqual([
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2, 3, 4] }
      ]);
    });

    it('should extract default group values when grouped on object', async () => {
      const value = [
        { number: 1, object: { id: 0 } },
        { number: 2, object: { id: 1 } },
        { number: 3, object: { id: 2 } },
        { number: 4, object: { id: 1 } },
        { number: 4, object: { id: 2 } }
      ];

      const groups = [{ 'object': { comparator: (a, b) => a.id === b.id } }];
      const result = await extractGroupValues(value, groups);
      expect(result).toEqual([
        { object: [{ id: 0 } , { id: 1 }, { id: 2 }] },
      ]);
    });

    it('should extract tree value when provided', async () => {
      const value = [
        { string: '1.1', boolean: true },
        { string: '1.1.1', boolean: false },
        { string: '2.1', boolean: true },
        { string: '2.2', boolean: false }
      ];

      const groups = [
        {
          'string': {
            tree: [
              {
                string: '1',
                children: [{ string: '1.1', children: [{ string: '1.1.1' }] }]
              },
              {
                string: '2',
                children: [
                  { string: '2.1' },
                  { string: '2.2' }
                ]
              }
            ]
          }
        }
      ];
      const result = await extractGroupValues(value, groups);
      expect(result).toEqual([
        {
          string: [
            {
              string: '1',
              children: [{ string: '1.1', children: [{ string: '1.1.1' }] }]
            },
            {
              string: '2',
              children: [
                { string: '2.1' },
                { string: '2.2' }
              ]
            }
          ]
        },
      ]);
    });

  });

  describe('buildGroupsTree', () => {
    it('should build groups tree', async () => {
      const groupValues = [
        { string: ['1', '2'] },
        { boolean: [true, false] },
        { number: [1, 2] }
      ];
      const result = await buildGroupsTree(groupValues);
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

    it('should build hierarchical groups tree', async () => {
      const groupValues = [
        {
          object: [
            { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
            { id: '2', children: [{ id: '2.1' }] }
          ]
        },
        { boolean: [true, false] }
      ];
      const result = await buildGroupsTree(groupValues);
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
    it('should fill groups tree', async () => {
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
      const result = await fillGroupsTree(array, groupsTree, groups);
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

    it('should fill heirarchical groups tree', async () => {
      const array = [
        { object: { id: '1.1.1' }, boolean: true, number: 1 },
        { object: { id: '1.1.1' }, boolean: false, number: 2 },
        { object: { id: '2.1' }, boolean: true, number: 3 },
        { object: { id: '2.1' }, boolean: false, number: 4 }
      ];
      const groupsTree = [
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
      ];
      const groups = [
        {
          object: { comparator: (a, b) => a.id === b.id },
        },
        'boolean'
      ];
      const result = await fillGroupsTree(array, groupsTree, groups);
      expect(result).toEqual([
        {
          object: { id: '1' },
          children: [
            {
              object: { id: '1.1' },
              children: [
                {
                  object: { id: '1.1.1' },
                  children: [
                    { boolean: true, children: [{ object: { id: '1.1.1' }, boolean: true, number: 1 }] },
                    { boolean: false, children: [{ object: { id: '1.1.1' }, boolean: false, number: 2 }] }
                  ]
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
              children: [
                { boolean: true, children: [{ object: { id: '2.1' }, boolean: true, number: 3 }] },
                { boolean: false, children: [{ object: { id: '2.1' }, boolean: false, number: 4 }] }
              ]
            }
          ]
        }
      ]);
    });
  });
  
  describe('reduceGroups', () => {
    
    it('should reduce groups with custom reducers and initial values', async () => {
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
      const groups = [
        { string: { reducer, initialReducerValue } },
        { boolean: { reducer, initialReducerValue } }
      ];
      const result = await reduceGroups(tree, groups);
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

    it('should reduce hierarchical values', async () => {
      const tree = [
        {
          object: { id: '1' },
          children: [
            {
              object: { id: '1.1' },
              children: [
                {
                  object: { id: '1.1.1' },
                  children: [
                    { boolean: true, children: [{ object: { id: '1.1.1' }, boolean: true, number: 1 }] },
                    { boolean: false, children: [{ object: { id: '1.1.1' }, boolean: false, number: 2 }] }
                  ]
                }
              ]
            },
            {
              object: { id: '1.2' },
              children: [
                { boolean: true, children: [{ object: { id: '1.2' }, boolean: true, number: 5 }] },
                { boolean: false, children: [{ object: { id: '1.2' }, boolean: false, number: 8 }] }
              ]
            }
          ]
        },
        {
          object: { id: '2' },
          children: [
            {
              object: { id: '2.1' },
              children: [
                { boolean: true, children: [{ object: { id: '2.1' }, boolean: true, number: 3 }] },
                { boolean: false, children: [{ object: { id: '2.1' }, boolean: false, number: 4 }] }
              ]
            }
          ]
        }
      ];
      const groups = [
        { object: { reducer, initialReducerValue } },
        { boolean: { reducer, initialReducerValue } }
      ];
      const result = await reduceGroups(tree, groups);
      expect(result).toEqual([
        {
          object: { id: '1' },
          number: 16,
          children: [
            {
              object: { id: '1.1' },
              number: 3,
              children: [
                {
                  object: { id: '1.1.1' },
                  number: 3,
                  children: [
                    { boolean: true, number: 1, children: [{ object: { id: '1.1.1' }, boolean: true, number: 1 }] },
                    { boolean: false, number: 2, children: [{ object: { id: '1.1.1' }, boolean: false, number: 2 }] }
                  ]
                }
              ]
            },
            {
              object: { id: '1.2' },
              number: 13,
              children: [
                { boolean: true, number: 5, children: [{ object: { id: '1.2' }, boolean: true, number: 5 }] },
                { boolean: false, number: 8, children: [{ object: { id: '1.2' }, boolean: false, number: 8 }] }
              ]
            }
          ]
        },
        {
          object: { id: '2' },
          number: 7,
          children: [
            {
              object: { id: '2.1' },
              number: 7,
              children: [
                { boolean: true, number: 3, children: [{ object: { id: '2.1' }, boolean: true, number: 3 }] },
                { boolean: false, number: 4, children: [{ object: { id: '2.1' }, boolean: false, number: 4 }] }
              ]
            }
          ]
        }
      ]);
    });
  });

  describe('group', () => {
    it('should group array', async () => {
      const array = [
        { string: '1', number: 5 },
        { string: '2', number: 2 },
        { string: '2', number: 3 },
        { string: '1', number: 8 },
      ];
      const groups = [
        { string: { reducer, initialReducerValue } }
      ];
      const result = await group(array, groups);
      expect(result).toEqual([
        {
          string: '1',
          number: 13,
          children: [
            { string: '1', number: 5 },
            { string: '1', number: 8 }
          ]
        },
        {
          string: '2',
          number: 5,
          children: [
            { string: '2', number: 2 },
            { string: '2', number: 3 }
          ]
        }
      ]);
    });
  });

});