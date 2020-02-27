import filter from './';

describe('await filter', () => {
    
  const value = [
    { string: '1', number: 1 },
    { string: '2', number: 2 },
    { string: '1', number: 3 }
  ];

  it('should apply default eq filter', async () => {
    const result = await filter(value, [{ string: '2' }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

  it('should apply eq filter', async () => {
    const result = await filter(value, [{ string: { $eq: '2' } }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

  it('should apply ne filter', async () => {
    const result = await filter(value, [{ string: { $ne: '2' } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
  });

  it('should apply eq filters in default \'and\' chain', async () => {
    const result = await filter(value, [{ string: '1' }, { number: 3 }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply eq filters in named \'and\' chain', async () => {
    const result = await filter(value, { $and: [{ string: '1' }, { number: 3 }] });
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply \'or\' filter', async () => {
    const result = await filter(value, { $or: [{ string: '1' }, { number: 3 }] });
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
  });

  it('should apply $in filter', async () => {
    const result = await filter(value, [{ number: { $in: [1, 2] } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
  });

  it('should apply $nin filter', async () => {
    const result = await filter(value, [{ number: { $nin: [1, 2] } }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply $gt filter', async () => {
    const result = await filter(value, [{ number: { $gt: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 3 }]);
  });

  it('should apply $gte filter', async () => {
    const result = await filter(value, [{ number: { $gte: 2 } }]);
    expect(result).toEqual([{ string: '2', number: 2 }, { string: '1', number: 3 }]);
  });

  it('should apply $lt await filter', async () => {
    const result = await filter(value, [{ number: { $lt: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 1 }]);
  });

  it('should apply $lte filter', async () => {
    const result = await filter(value, [{ number: { $lte: 2 } }]);
    expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
  });

  it('should apply custom filter', async () => {
    const result = await filter(value, [{ number: value => value === 2 }]);
    expect(result).toEqual([{ string: '2', number: 2 }]);
  });

  it('should await filter dates', async () => {
    const value = [
      { date: new Date(2000, 0, 0) },
      { date: new Date(2000, 1, 0) },
      { date: new Date(2000, 2, 0) }
    ];
    const result = await filter(value, [{ date: { $lte: new Date(2000, 1, 0) } }]);
    expect(result).toEqual([ { date: new Date(2000, 0, 0) }, { date: new Date(2000, 1, 0) }]);
  });

});