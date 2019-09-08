import {
  getItemsOnPage,
  setSyncValueMetaTotalCounts,
  getScrollPages,
  getPageNumberFromScrollPages,
  shiftScrollPages,
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

  describe('setSyncValueMetaTotalCounts', () => {
    it('generates meta object and sets sync value total counts when no initial meta specified', () => {
      const value = [
        {},
        {
          children: [
            {},
            {}
          ]
        },
        {}
      ]
      expect(setSyncValueMetaTotalCounts(value)).toEqual({
        totalCount: 3,
        children: [
          undefined,
          { totalCount: 2 },
          undefined
        ]
      });
    });

    it('preserves meta internal data if specified', () => {
      const meta = {
        totalCount: 5,
        children: [
          { size: 100 },
          {
            size: 50,
            expanded: true
          },
          { size: 80 }
        ]
      };
      const value = [
        {},
        {
          children: [
            {},
            {}
          ]
        },
        {}
      ]
      expect(setSyncValueMetaTotalCounts(value, meta)).toEqual({
        totalCount: 3,
        children: [
          { size: 100 },
          {
            size: 50,
            expanded: true,
            totalCount: 2
          },
          { size: 80 }
        ]
      });
    });

    it('empty children not included', () => {
      const value = [
        {},
        {},
        {}
      ]
      expect(setSyncValueMetaTotalCounts(value)).toEqual({
        totalCount: 3
      });
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
        { start: 0, end: 60 },
        { start: 60, end: 80 }
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
        { start: 0, end: 80 },
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
        { start: 0, end: 80 },
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
        { start: 0, end: 100 },
        { start: 100, end: 120 }
      ]);
    });

  });

  describe('shiftScrollPages', () => {
    const scrollPages = [
      { start: 0, end: 20 },
      { start: 20, end: 60 },
      { start: 60, end: 80 }
    ];
    it('shifts bounds', () => {
      expect(shiftScrollPages(scrollPages)).toEqual([
        { start: 0, end: 10 },
        { start: 10, end: 40 },
        { start: 40, end: 70 }
      ]);
    })
  });

  describe('getPageNumberFromScrollPages', () => {
    const scrollPages = [
      { start: 0, end: 20 },
      { start: 20, end: 40 },
      { start: 40, end: 50 }
    ];
    it('should return 0 on scroll 0', () => {
      expect(getPageNumberFromScrollPages(scrollPages, 0)).toBe(0);
    });
    it('should return 1 on scroll 20', () => {
      expect(getPageNumberFromScrollPages(scrollPages, 20)).toBe(1);
    });
    it('should return 1 on scroll 30', () => {
      expect(getPageNumberFromScrollPages(scrollPages, 30)).toBe(1);
    });
    it('should return 2 on scroll 45', () => {
      expect(getPageNumberFromScrollPages(scrollPages, 45)).toBe(2);
    });
  });

  describe('getPageNumberWithDefaultSize', () => {
    it('should return 0 on scroll 0', () => {
      expect(getPageNumberWithDefaultSize(20, 1, 0)).toBe(0);
    });
    it('should return 1 on scroll 10, default size - 20 and items per page - 1', () => {
      expect(getPageNumberWithDefaultSize(20, 1, 10)).toBe(1);
    });
    it('should return 2 on scroll 20, default size - 20 and items per page - 1', () => {
      expect(getPageNumberWithDefaultSize(20, 1, 20)).toBe(1);
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