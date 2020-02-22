import group, { extractGroupValues } from './';

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