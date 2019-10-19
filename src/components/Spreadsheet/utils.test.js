import { getFixedCellOffset } from './utils';

describe('Spreadsheet utils', () => {

  describe('getFixedCellOffset', () => {

    it('should calculate offset for fixed item', () => {
      const defaultSize = 20;
      const meta = [
        { size: 30, fixed: true },
        { fixed: true },
        { level: 1, size: 50, fixed: true },
        { level: 1, fixed: true },
        { level: 2, fixed: true },
        { level: 1 }
      ];
      expect(getFixedCellOffset({ meta, defaultSize, index: 4 })).toEqual(120);
    });

    it('should calculate offset for group items', () => {
      const defaultSize = 20;
      const meta = [
        { size: 30, fixed: true },
        { fixed: true },
        { isGroup: true },
        { level: 1, size: 50 },
        { level: 1, isGroup: true, size: 30 },
        { level: 2 },
        { level: 2, isGroup: true },
        { level: 3 },
        { level: 3 },
        { level: 1, isGroup: true },
        { level: 2 },
        { level: 2 }
      ];
      expect(getFixedCellOffset({ meta, defaultSize, index: 4 })).toEqual(70);
      expect(getFixedCellOffset({ meta, defaultSize, index: 6 })).toEqual(100);
      expect(getFixedCellOffset({ meta, defaultSize, index: 9 })).toEqual(70);
    });

  });
  
});