import { dataCompose, dataComposeAsync } from './';

describe('dataCompose', () => {

  describe('filter', () => {
    
    const value = [
      { string: '1', number: 1 },
      { string: '2', number: 2 },
      { string: '1', number: 3 }
    ];

    it('should apply default eq filter', () => {
      const result = dataCompose(value, { filter: [{ string: '2' }] });
      expect(result).toEqual([{ string: '2', number: 2 }]);
    });

    it('should apply eq filter', () => {
      const result = dataCompose(value, { filter: [{ string: { $eq: '2' } }] });
      expect(result).toEqual([{ string: '2', number: 2 }]);
    });

    it('should apply ne filter', () => {
      const result = dataCompose(value, { filter: [{ string: { $ne: '2' } }] });
      expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
    });

    it('should apply eq filters in default \'and\' chain', () => {
      const result = dataCompose(value, { filter: [{ string: '1' }, { number: 3 }] });
      expect(result).toEqual([{ string: '1', number: 3 }]);
    });

    it('should apply eq filters in named \'and\' chain', () => {
      const result = dataCompose(value, { filter: { $and: [{ string: '1' }, { number: 3 }] } });
      expect(result).toEqual([{ string: '1', number: 3 }]);
    });

    it('should apply or filter', () => {
      const result = dataCompose(value, { filter: { $or: [{ string: '1' }, { number: 3 }] } });
      expect(result).toEqual([{ string: '1', number: 1 }, { string: '1', number: 3 }]);
    });

    it('should apply $in filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $in: [1, 2] } }] });
      expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
    });

    it('should apply $nin filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $nin: [1, 2] } }] });
      expect(result).toEqual([{ string: '1', number: 3 }]);
    });

    it('should apply $gt filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $gt: 2 } }] });
      expect(result).toEqual([{ string: '1', number: 3 }]);
    });

    it('should apply $gte filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $gte: 2 } }] });
      expect(result).toEqual([{ string: '2', number: 2 }, { string: '1', number: 3 }]);
    });

    it('should apply $lt filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $lt: 2 } }] });
      expect(result).toEqual([{ string: '1', number: 1 }]);
    });

    it('should apply $lte filter', () => {
      const result = dataCompose(value, { filter: [{ number: { $lte: 2 } }] });
      expect(result).toEqual([{ string: '1', number: 1 }, { string: '2', number: 2 }]);
    });

    it('should apply custom filter', () => {
      const result = dataCompose(value, { filter: [{ number: value => value === 2 }] });
      expect(result).toEqual([{ string: '2', number: 2 }]);
    });

  });

});