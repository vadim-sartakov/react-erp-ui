import {
  getItemsCountOnPage,
  getScrollPages,
  getPageNumberFromScrollPages,
  getVisibleIndexesWithDefaultSize,
  getGapsWithDefaultSize,
  getGapsFromScrollPages,
  getFixedOffsets
} from './utils';

describe('Scroller utils', () => {
  
  describe('getItemsCountOnPage', () => {
    it('should return items per page count on middle page', () => {
      expect(getItemsCountOnPage(1, 10, 35)).toBe(10);
    });
    it('should return only remained items on last page', () => {
      expect(getItemsCountOnPage(3, 10, 35)).toBe(5);
    });
  });

  describe('getScrollPages', () => {

    it('should return equal ranges with default sizes and total count 3', () => {
      const meta = [
        {},
        {},
        {}
      ];
      const result = getScrollPages({ meta, totalCount: 3, defaultSize: 20, itemsPerPage: 2 });
      expect(result).toEqual([
        { start: 0, end: 40 },
        { start: 40, end: 60 }
      ]);
    });

    it('should return equal ranges with default sizes and total count 4', () => {
      const meta = [
        {},
        {},
        {},
        {}
      ];
      const result = getScrollPages({ meta, defaultSize: 20, itemsPerPage: 2, totalCount: 4 });
      expect(result).toEqual([
        { start: 0, end: 40 },
        { start: 40, end: 80 }
      ]);
    });

    it('should return longer range when custom size in the middle is specified', () => {
      const meta = [
        {},
        { size: 40 },
        {}
      ];
      const result = getScrollPages({ meta, defaultSize: 20, itemsPerPage: 2, totalCount: 3 });
      expect(result).toEqual([
        { start: 0, end: 60 },
        { start: 60, end: 80 }
      ]);
    });

    it('should return longer ranges when custom size is specified in multiple places', () => {
      const meta = [
        {},
        { size: 40 },
        { size: 60 }
      ];
      const result = getScrollPages({ meta, defaultSize: 20, itemsPerPage: 2, totalCount: 3 });
      expect(result).toEqual([
        { start: 0, end: 60 },
        { start: 60, end: 120 }
      ]);
    });

  });

  describe('getPageNumberFromScrollPages', () => {

    it('should return initial page - 0 on scroll 0', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 0)).toBe(0);
    });

    it('should return cur page when scrolled less then half of current', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 },
        { start: 40, end: 60 },
        { start: 60, end: 80 },
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 45)).toBe(2);
    });

    it('should return next page when scrolled half of current', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 },
        { start: 40, end: 60 },
        { start: 60, end: 80 },
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 55)).toBe(3);
    });

    it('should return initial page - 0 on negative scroll', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, -20)).toBe(0);
    });

    it('should return last page when next page is more than page count', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 200)).toBe(1);
    });

    it('should return last page when scroll value is more than the whole scroll range size', () => {
      const scrollPages = [
        { start: 0, end: 20 },
        { start: 20, end: 40 }
      ];
      expect(getPageNumberFromScrollPages(scrollPages, 200)).toBe(1);
    });
  });

  describe('getVisibleIndexesWithDefaultSize', () => {
    it('should return first visible indexes with default overscroll', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 0, totalCount: 200 })).toEqual([0, 1, 2, 3, 4]);
    });
    it('should return first visible indexes on negative scroll value and provided overscroll value', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: -150, totalCount: 200, overscroll: 2 })).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });
    it('should not get out of start bounds with overscroll value', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 10, totalCount: 200, overscroll: 2 })).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
    it('should not get out of end bounds with overscroll value', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 1950, totalCount: 200, overscroll: 2 })).toEqual([193, 194, 195, 196, 197, 198, 199]);
    });
    it('should return visible indexes in middle scroll and default overscroll', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 50, totalCount: 200 })).toEqual([5, 6, 7, 8, 9]);
    });
    it('should return visible indexes in middle scroll and provided overscroll value', () => {
      expect(getVisibleIndexesWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 50, totalCount: 200, overscroll: 2 })).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });
  });

  describe('getGapsWithDefaultSize', () => {
    it('start page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 0 })).toEqual({ start: 0, middle: 40, end: 60 });
    });
    it('middle page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 3 })).toEqual({ start: 40, middle: 40, end: 20 });
    });
    it('last page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 5, page: 4 })).toEqual({ start: 60, middle: 40, end: 0 });
    });
    it('middle page with 10 items per page', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 10, totalCount: 35, page: 2 })).toEqual({ start: 200, middle: 400, end: 100 });
    });
    it('last page with half content', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 10, totalCount: 25, page: 2 })).toEqual({ start: 200, middle: 300, end: 0 });
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
      expect(getGapsFromScrollPages({ scrollPages, page: 0 })).toEqual({ start: 0, middle: 60, end: 90 });
    });
    it('middle page', () => {
      expect(getGapsFromScrollPages({ scrollPages, page: 2 })).toEqual({ start: 20, middle: 80, end: 50 });
    });
    it('last page', () => {
      expect(getGapsFromScrollPages({ scrollPages, page: 3 })).toEqual({ start: 60, middle: 90, end: 0 });
    });
  });

  describe('getFixedOffsets', () => {
    it('should return offsets without meta', () => {
      expect(getFixedOffsets({ defaultSize: 20, fixed: 3 })).toEqual([0, 20, 40]);
    });

    it('should return offsets with default sizes', () => {
      const meta = [
        undefined,
        undefined,
        { size: 10 },
        { size: 20 }
      ];
      expect(getFixedOffsets({ meta, defaultSize: 20, fixed: 3 })).toEqual([0, 20, 40]);
    });

    it('should return offsets with custom sizes', () => {
      const meta = [
        { size: 20 },
        { size: 30 },
        { size: 10 },
        { size: 20 }
      ];
      expect(getFixedOffsets({ meta, defaultSize: 20, fixed: 3 })).toEqual([0, 20, 50]);
    });
  });

});