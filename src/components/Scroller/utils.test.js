import {
  getItemsOnPage,
  getScrollPages,
  getPageNumberFromScrollPages,
  getPageNumberWithDefaultSize,
  getGapsWithDefaultSize,
  getGapsFromScrollPages
} from './utils';

describe('Scroller utils', () => {
  
  describe('getItemsOnPage', () => {
    it('middle page', () => {
      expect(getItemsOnPage(1, 10, 35)).toBe(10);
    });
    it('last page', () => {
      expect(getItemsOnPage(3, 10, 35)).toBe(5);
    });
  });

  describe('getScrollPages', () => {

    it('expanded second item', () => {
      const meta = {
        totalCount: 3,
        children: [
          {},
          {
            expanded: true,
            children: [{}]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 60, children: [{ start: 40, end: 60 }] },
        { start: 60, end: 80 }
      ]);
    });

    it('expanded item in the end', () => {
      const meta = {
        totalCount: 4,
        children: [
          {},
          {},
          {},
          {
            expanded: true,
            children: [{}]
          }
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 40 },
        { start: 40, end: 100, children: [{ start: 80, end: 100 }] }
      ]);
    });

    it('multiple expanded per page', () => {
      const meta = {
        totalCount: 3,
        children: [
          {
            expanded: true,
            children: [{}]
          },
          {
            expanded: true,
            children: [{}]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 80, children: [{ start: 20, end: 40 }, { start: 60, end: 80 }] },
        { start: 80, end: 100 }
      ]);
    });

    it('expanded second nested item should be twice bigger', () => {
      const meta = {
        totalCount: 3,
        children: [
          {},
          {
            expanded: true,
            totalCount: 1,
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
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 80, children: [{ start: 40, end: 80 }] },
        { start: 80, end: 100 }
      ]);
    });

    it('second page should be with longer scroll range when custom size specified', () => {
      const meta = {
        totalCount: 3,
        children: [
          {},
          { size: 40 },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 60 },
        { start: 60, end: 80 }
      ]);
    });

    it('second page should be with longer scroll range when custom size specified and expanded', () => {
      const meta = {
        totalCount: 3,
        children: [
          {},
          {
            size: 40,
            expanded: true,
            totalCount: 1,
            children: [{}]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 80, children: [{ start: 60, end: 80 }] },
        { start: 80, end: 100 }
      ]);
    });

    it('second page should be with longer scroll range when custom size specified for self and expanded items', () => {
      const meta = {
        totalCount: 3,
        children: [
          {},
          {
            size: 40,
            expanded: true,
            totalCount: 1,
            children: [{ size: 40 }]
          },
          {}
        ]
      };
      const result = getScrollPages(meta, 20, 2);
      expect(result).toEqual([
        { start: 0, end: 100, children: [{ start: 60, end: 100 }] },
        { start: 100, end: 120 }
      ]);
    });

  });

  describe('getPageNumberFromScrollPages', () => {

    it('returns initial page - 0 on scroll 0', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 0)).toBe(0);
    });

    it('returns next page when scrolled half of current', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 15)).toBe(1);
    });

    it('returns current page when scrolled on children which starts in page\'s first half', () => {
      const scrollPages = [
        { start: 0, end: 20, children: [{ start: 2, end: 15 }] },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 5)).toBe(0);
    });

    it('returns next page when scrolled on children which starts in page\'s second half', () => {
      const scrollPages = [
        { start: 0, end: 20, children: [{ start: 15, end: 20 }] },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 15)).toBe(1);
    });

    it('returns initial page - 0 on negative scroll', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, -20)).toBe(0);
    });

    it('returns last page when next page is more than page count', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 200)).toBe(1);
    });

    it('returns last page when scroll value is more than the whole scroll range size', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 200)).toBe(1);
    });
  });

  describe('getPageNumberWithDefaultSize', () => {
    it('should return 0 on scroll 0', () => {
      expect(getPageNumberWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, scroll: 0, totalCount: 10 })).toBe(0);
    });
    it('should return 1 on scroll 10, default size - 20 and items per page - 1', () => {
      expect(getPageNumberWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, scroll: 10, totalCount: 10 })).toBe(1);
    });
    it('should return 2 on scroll 20, default size - 20 and items per page - 1', () => {
      expect(getPageNumberWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, scroll: 20, totalCount: 10 })).toBe(1);
    });
    it('should return first page when scroll is negative', () => {
      expect(getPageNumberWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, scroll: -20, totalCount: 10 })).toBe(0);
    });
    it('should return last page when scroll is exceeded', () => {
      expect(getPageNumberWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, scroll: 500, totalCount: 10 })).toBe(9);
    });
  });

  describe('getGapsWithDefaultSize', () => {
    it('start page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 0 })).toEqual({ start: 0, end: 80 });
    });
    it('middle page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 3 })).toEqual({ start: 40, end: 20 });
    });
    it('last page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 4 })).toEqual({ start: 60, end: 0 });
    });
    it('middle page with 10 items per page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 10, totalCount: 35, page: 2 })).toEqual({ start: 200, end: 100 });
    });
    it('last page with half content', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 10, totalCount: 25, page: 2 })).toEqual({ start: 200, end: 0 });
    });
  });

  describe('getGapsFromScrollPages', () => {
    const scrollPages = [
      { start: 0, end: 20 },
      { start: 20, end: 60 },
      { start: 60, end: 100 },
      { start: 100, end: 150 }
    ];
    it('first page', () => {
      expect(getGapsFromScrollPages(scrollPages, 0)).toEqual({ start: 0, end: 130 });
    });
    it('middle page', () => {
      expect(getGapsFromScrollPages(scrollPages, 2)).toEqual({ start: 20, end: 50 });
    });
    it('last page', () => {
      expect(getGapsFromScrollPages(scrollPages, 3)).toEqual({ start: 60, end: 0 });
    });
  });

});