import {
  getMergedCellPosition,
  getCellsRangeSize,
  getGroups
} from './utils';

describe('Spreadsheet utils', () => {

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
      expect(getMergedCellPosition({ index: 0 })).toBe(0);
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
      const result = getMergedCellPosition({ meta, defaultSize, index: 4 });
      expect(result).toBe(120);
    });

  });

  describe('getGroups', () => {

    it('should calculate groups', () => {
      const meta = [
        { level: 1 },
        { level: 1 },
        { level: 1 },
        { level: 2 },
        { level: 2 },
        { level: 3 },
        { level: 3 },
        { level: 3 },
        { level: 3 },
        {},
        { level: 1 },
        { level: 1 },
        { level: 2 },
        { level: 2 },
        { level: 1 }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        // Level 1 group
        [
          {
            start: 0,
            end: 8
          },
          {
            start: 10,
            end: 14
          }
        ],
        // Level 2 group
        [
          {
            start: 3,
            end: 8
          },
          {
            start: 12,
            end: 13
          }
        ],
        // Level 3 group
        [
          {
            start: 5,
            end: 8
          }
        ]
      ]);
    });

  });

});