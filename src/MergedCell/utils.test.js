import { getCellsRangeSize, getCellPosition } from './utils';

describe('MergedCell utils', () => {
  describe('getCellsRangeSize', () => {

    it('should calculate size', () => {
      const meta = [
        { size: 10 },
        undefined,
        { size: 50 },
        { size: 60 },
        undefined,
        { size: 30 }
      ];
      const defaultSize = 20;
      const result = getCellsRangeSize({ meta, startIndex: 1, count: 4, defaultSize });
      expect(result).toBe(150);
    });

  });

  describe('getMergedCellsPosition', () => {

    it('should return 0 when index is 0', () => {
      expect(getCellPosition({ index: 0 })).toBe(0);
    });

    it('should calculate position', () => {
      const meta = [
        { size: 30 },
        undefined,
        undefined,
        { size: 50 },
        { size: 40 }
      ];
      const defaultSize = 20;
      const result = getCellPosition({ meta, defaultSize, index: 4 });
      expect(result).toBe(120);
    });

  });
});