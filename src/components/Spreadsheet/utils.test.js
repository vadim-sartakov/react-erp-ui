import {
  getGroups
} from './utils';

describe('Spreadsheet utils', () => {

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