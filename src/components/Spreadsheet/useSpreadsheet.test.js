import {
  convertExternalMetaToInternal,
  convertInternalMetaToExternal,
  convertExternalValueToInternal,
  convertInternalValueToExternal
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

  describe('convertExternalValueToInternal', () => {
    it('should convert external value to internal', () => {
      const value = [
        [
          '0 - 0',
          '0 - 1',
          '0 - 2'
        ],
        [
          '1 - 0',
          '1 - 1',
          '1 - 2'
        ],
        [
          '2 - 0',
          '2 - 1',
          '2 - 2'
        ]
      ];
      const hiddenRowsIndexes = [1];
      const hiddenColumnsIndexes = [2];
      const result = convertExternalValueToInternal({ value, specialRowsCount: 1, specialColumnsCount: 1, hiddenRowsIndexes, hiddenColumnsIndexes });
      expect(result).toEqual([
        undefined,
        [
          undefined,
          '0 - 0',
          '0 - 1'
        ],
        [
          undefined,
          '2 - 0',
          '2 - 1'
        ]
      ]);
    });
  });

  describe('convertInternalValueToExternal', () => {
    it('should convert internal value to external', () => {
      const value = [
        undefined,
        [
          undefined,
          '0 - 0 - 0',
          '0 - 1 - 1'
        ],
        [
          undefined,
          '2 - 0 - 0',
          '2 - 1 - 1'
        ]
      ];
      const originExternalValue = [
        [
          '0 - 0',
          '0 - 1',
          '0 - 2'
        ],
        [
          '1 - 0',
          '1 - 1',
          '1 - 2'
        ],
        [
          '2 - 0',
          '2 - 1',
          '2 - 2'
        ]
      ];
      const hiddenRowsIndexes = [1];
      const hiddenColumnsIndexes = [2];
      const result = convertInternalValueToExternal({ value, originExternalValue, specialRowsCount: 1, specialColumnsCount: 1, hiddenRowsIndexes, hiddenColumnsIndexes });
      expect(result).toEqual([
        [
          '0 - 0 - 0',
          '0 - 1 - 1',
          '0 - 2'
        ],
        [
          '1 - 0',
          '1 - 1',
          '1 - 2'
        ],
        [
          '2 - 0 - 0',
          '2 - 1 - 1',
          '2 - 2'
        ]
      ]);
    });
  });

});