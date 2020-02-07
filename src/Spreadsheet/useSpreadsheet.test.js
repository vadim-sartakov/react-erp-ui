import {
  convertExternalMetaToInternal,
  convertInternalMetaToExternal
} from './useSpreadsheet';

describe('useSpreadsheet', () => {
  
  describe('convertExternalMetaToInternal', () => {
    it('should convert external meta to internal', () => {
      const meta = [
        { size: 10, hidden: true },
        { size: 20 },
        { size: 30, hidden: true },
        { size: 40 },
        { size: 50 },
        { size: 60 }
      ];
      const groups = [
        [
          { start: 1, end: 10 }
        ],
        [
          { start: 2, end: 5 }
        ]
      ];
      const result = convertExternalMetaToInternal({ meta, groups, groupSize: 20, numberMetaSize: 30 });
      expect(result).toEqual([
        { type: 'GROUP', size: 20 },
        { type: 'GROUP', size: 20 },
        { type: 'GROUP', size: 20 },
        { type: 'NUMBER', size: 30 },
        { size: 20 },
        { size: 40 },
        { size: 50 },
        { size: 60 }
      ]);
    });
  });

  describe('convertInternalMetaToExternal', () => {
    it('should convert internal meta to external', () => {
      const meta = [
        { type: 'GROUP', size: 20 },
        { type: 'GROUP', size: 20 },
        { type: 'GROUP', size: 20 },
        { type: 'NUMBER', size: 30 },
        { size: 120 },
        { size: 140 },
        { size: 150 },
        { size: 160 }
      ];
      const originExternalMeta = [
        { size: 10 },
        { size: 20 },
        { size: 30 },
        { size: 40 },
        { size: 50 },
        { size: 60 }
      ];
      const hiddenIndexes = [0, 2];
      const result = convertInternalMetaToExternal({ meta, originExternalMeta, hiddenIndexes });
      expect(result).toEqual([
        { size: 10 },
        { size: 120 },
        { size: 30 },
        { size: 140 },
        { size: 150 },
        { size: 160 }
      ]);
    })
  });

});