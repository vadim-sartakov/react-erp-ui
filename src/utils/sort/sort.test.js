import sort from './';

describe('sort', () => {
  
  const value = [
    { number: 4, string: '1' },
    { number: 2, string: '2' },
    { number: 3, string: '1' },
    { number: 1, string: '3' },
  ];

  it('should apply default asc sort', () => {
    const result = sort(value, ['number']);
    expect(result).toEqual([
      { number: 1, string: '3' },
      { number: 2, string: '2' },
      { number: 3, string: '1' },
      { number: 4, string: '1' },     
    ]);
  });

  it('should apply asc sort', () => {
    const result = sort(value, [{ 'number': 1 }]);
    expect(result).toEqual([
      { number: 1, string: '3' },
      { number: 2, string: '2' },
      { number: 3, string: '1' },
      { number: 4, string: '1' },     
    ]);
  });

  it('should apply desc sort', () => {
    const result = sort(value, [{ 'number': -1 }]);
    expect(result).toEqual([
      { number: 4, string: '1' },
      { number: 3, string: '1' },
      { number: 2, string: '2' },
      { number: 1, string: '3' },
    ]);
  });

  it('should apply combined default asc sort', () => {
    const result = sort(value, ['string', 'number']);
    expect(result).toEqual([
      { number: 3, string: '1' },
      { number: 4, string: '1' },
      { number: 2, string: '2' },
      { number: 1, string: '3' }      
    ]);
  });

  it('should apply combined asc and desc sort', () => {
    const result = sort(value, [{ 'string': 1 }, { 'number': -1 }]);
    expect(result).toEqual([
      { number: 4, string: '1' },
      { number: 3, string: '1' },
      { number: 2, string: '2' },
      { number: 1, string: '3' }      
    ]);
  });

  it('should sort dates asc', () => {
    const value = [
      { date: new Date(2000, 3, 0) },
      { date: new Date(2000, 2, 0) },
      { date: new Date(2000, 1, 0) }
    ];
    const result = sort(value, [{ 'date': 1 }]);
    expect(result).toEqual([
      { date: new Date(2000, 1, 0) },
      { date: new Date(2000, 2, 0) },
      { date: new Date(2000, 3, 0) }
    ]);
  });

});