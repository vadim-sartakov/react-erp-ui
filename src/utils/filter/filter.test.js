import filter from './';

describe('filter', () => {
    
  const value = [
    { string: '1', number: 1 },
    { string: '2', number: 2 },
    { string: '1', number: 3 }
  ];

  it('should apply default eq filter', () => {
    const result = filter(value, [{ string: '2' }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

  it('should apply eq filter', () => {
    const result = filter(value, [{ string: { $eq: '2' } }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

  it('should apply ne filter', () => {
    const result = filter(value, [{ string: { $ne: '2' } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
  });

  it('should apply eq filters in default \'and\' chain', () => {
    const result = filter(value, [{ string: '1' }, { number: 3 }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply eq filters in named \'and\' chain', () => {
    const result = filter(value, { $and: [{ string: '1' }, { number: 3 }] });
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply \'or\' filter', () => {
    const result = filter(value, { $or: [{ string: '1' }, { number: 3 }] });
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
  });

  it('should apply $in filter', () => {
    const result = filter(value, [{ number: { $in: [1, 2] } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
  });

  it('should apply $nin filter', () => {
    const result = filter(value, [{ number: { $nin: [1, 2] } }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply $gt filter', () => {
    const result = filter(value, [{ number: { $gt: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply $gte filter', () => {
    const result = filter(value, [{ number: { $gte: 2 } }]);
    expect(result).toEqual([{ string: '2', number: 2 }, { string: '1', number: 3 }]);
  });

  it('should apply $lt filter', () => {
    const result = filter(value, [{ number: { $lt: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 1 }]);
  });

  it('should apply $lte filter', () => {
    const result = filter(value, [{ number: { $lte: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
  });

  it('should apply custom filter', () => {
    const result = filter(value, [{ number: value => value === 2 }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

});