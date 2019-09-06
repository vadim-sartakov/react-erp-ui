import { getScrollPages } from './utils';

describe('Scroller utils', () => {
  
  describe('getScrollPages', () => {

    it('expanded second item should be bigger', () => {
      const meta = {
        children: [
          {},
          {
            expanded: true,
            children: [{}]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 1, 3);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 60 },
        { start: 60, end: 80 }
      ]);
    });

    it('expanded second nested item should be twice bigger', () => {
      const meta = {
        children: [
          {},
          {
            expanded: true,
            children: [
              {
                expanded: true,
                children: [{}]
              }
            ]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 1, 3);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 80 },
        { start: 80, end: 100 }
      ]);
    });

  });

});