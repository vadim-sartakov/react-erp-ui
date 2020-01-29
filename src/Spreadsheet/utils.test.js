import { getGroups } from './utils';

describe('Spreadsheet utils', () => {

  describe('getGroups', () => {

    it('should calculate plain groups', () => {
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
            end: 8,
            offsetStart: 0,
            offsetEnd: 8,
            level: 1
          },
          {
            start: 10,
            end: 14,
            offsetStart: 10,
            offsetEnd: 14,
            level: 1
          }
        ],
        // Level 2 group
        [
          {
            start: 3,
            end: 8,
            offsetStart: 3,
            offsetEnd: 8,
            level: 2
          },
          {
            start: 12,
            end: 13,
            offsetStart: 12,
            offsetEnd: 13,
            level: 2
          }
        ],
        // Level 3 group
        [
          {
            start: 5,
            end: 8,
            offsetStart: 5,
            offsetEnd: 8,
            level: 3
          }
        ]
      ]);
    });

    it('should correctly close group when last item\'s level is greater than previous', () => {
      const meta = [
        { level: 1 },
        { level: 1 },
        { level: 2 }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        [
          { start: 0, end: 2, level: 1, offsetStart: 0, offsetEnd: 2 }
        ],
        [
          { start: 2, end: 2, level: 2, offsetStart: 2, offsetEnd: 2 }
        ]
      ]);
    });

    it('should offset end parts when there are hidden meta', () => {
      const meta = [
        { level: 1 },
        { level: 1, hidden: true },
        { level: 1, hidden: true },
        { level: 1 },
        { level: 2 },
        { level: 2 }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        [
          { start: 0, end: 5, offsetStart: 0, offsetEnd: 3, level: 1 }
        ],
        [
          { start: 4, end: 5, offsetStart: 2, offsetEnd: 3, level: 2 }
        ]
      ]);

    });

    it('should collapse group when all meta is hidden', () => {
      const meta = [
        { level: 1 },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 1 },
        { level: 1 },
        {},
        {},
        { level: 2 },
        { level: 2 },
        { level: 2 }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        [
          { start: 0, end: 6, offsetStart: 0, offsetEnd: 2, level: 1 }
        ],
        [
          { start: 1, end: 4, offsetStart: 1, offsetEnd: 1, collapsed: true, level: 2 },
          { start: 9, end: 11, offsetStart: 5, offsetEnd: 7, level: 2 }
        ]
      ]);

    });

    it('should remove lower level enclosed groups when parent is collapsed', () => {
      const meta = [
        { level: 1, hidden: true },
        { level: 1, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true },
        { level: 2, hidden: true }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        [
          { start: 0, end: 7, offsetStart: 0, offsetEnd: 0, collapsed: true, level: 1 }
        ],
        []
      ]);
    });

    it('should offset higher level group elements when previous group of lower level is collapsed', () => {
      const meta = [
        { level: 1, hidden: true },
        { level: 1, hidden: true },
        {},
        { level: 1 },
        { level: 1 },
        { level: 2, hidden: true },
        { level: 2, hidden: true }
      ];
      const result = getGroups(meta);
      expect(result).toEqual([
        [
          { start: 0, end: 1, level: 1, offsetStart: 0, offsetEnd: 0, collapsed: true },
          { start: 3, end: 6, level: 1, offsetStart: 1, offsetEnd: 2 }
        ],
        [
          { start: 5, end: 6, level: 2, offsetStart: 3, offsetEnd: 3, collapsed: true }
        ]
      ]);
    });

  });

});