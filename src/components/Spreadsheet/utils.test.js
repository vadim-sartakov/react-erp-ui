import { getFixedCellOffset } from './utils';

describe('Spreadsheet utils', () => {

  describe('getFixedCellOffset', () => {

    it('should calculate offsets for multiple levels', () => {
      const defaultSize = 20;
      const meta = [
        { size: 30 },
        undefined,
        { level: 1, size: 50 },
        { level: 1 },
        { level: 2 },
        { level: 1 }
      ];
      expect(getFixedCellOffset({ meta, defaultSize, index: 4 })).toEqual(120);

    });

  });
  
});