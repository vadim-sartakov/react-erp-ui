import {
  getItemsCountOnPage,
  getScrollDataWithDefaultSize,
  getScrollDataWithCustomSizes,
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

  describe('getScrollDataWithDefaultSize', () => {
    it('should return first visible indexes with default overscroll', () => {
      const result = getScrollDataWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 0, totalCount: 200 });
      expect(result).toEqual({
        offset: 0, 
        size: 2000,
        visibleIndexes: [0, 1, 2, 3, 4]
      });
    });
    it('should not get out of start bounds with overscroll value', () => {
      const result = getScrollDataWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 10, totalCount: 200, overscroll: 2 });
      expect(result).toEqual({
        offset: 10,
        size: 2000,
        visibleIndexes: [0, 1, 2, 3, 4, 5, 6, 7]
      });
    });
    it('should not get out of end bounds with overscroll value', () => {
      const result = getScrollDataWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 1955, totalCount: 200, overscroll: 2 });
      expect(result).toEqual({
        offset: 1950,
        size: 2000,
        visibleIndexes: [193, 194, 195, 196, 197, 198, 199]
      });
    });
    it('should return visible indexes in middle scroll and default overscroll', () => {
      const result = getScrollDataWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 55, totalCount: 200 });
      expect(result).toEqual({
        offset: 50,
        size: 2000,
        visibleIndexes: [5, 6, 7, 8, 9]
      });
    });
    it('should return visible indexes in middle scroll and provided overscroll value', () => {
      const result = getScrollDataWithDefaultSize({ containerSize: 50, defaultSize: 10, scroll: 50, totalCount: 200, overscroll: 2 });
      expect(result).toEqual({
        offset: 50,
        size: 2000,
        visibleIndexes: [3, 4, 5, 6, 7, 8, 9, 10, 11]
      });
    });
  });

  describe('getScrollDataWithCustomSizes', () => {

    const sizes = [20, 30, 50, 80, 20, 10, 50, 90, 40, 30];

    it('should return first visible indexes', () => {
      const result = getScrollDataWithCustomSizes({ sizes, containerSize: 50, defaultSize: 10, totalCount: 200, scroll: 0 });
      expect(result).toEqual({
        offset: 0,
        size: 2320,
        visibleIndexes: [0, 1]
      });
    });

    it('should return first extended visible indexes when overscroll specified', () => {
      const result = getScrollDataWithCustomSizes({ sizes, containerSize: 50, defaultSize: 10, totalCount: 200, scroll: 0, overscroll: 2 });
      expect(result).toEqual({
        offset: 0,
        size: 2320,
        visibleIndexes: [0, 1, 2, 3]
      });
    });

    it('should return middle visible indexes when scrolled', () => {
      const result = getScrollDataWithCustomSizes({ sizes, containerSize: 50, defaultSize: 10, totalCount: 200, scroll: 181 });
      expect(result).toEqual({
        offset: 180,
        size: 2320,
        visibleIndexes: [4, 5, 6]
      });
    });

    it('should return extended middle visible indexes when scrolled and overscroll value provided', () => {
      const result = getScrollDataWithCustomSizes({ sizes, containerSize: 50, defaultSize: 10, totalCount: 200, scroll: 181, overscroll: 2 });
      expect(result).toEqual({
        offset: 180,
        size: 2320,
        visibleIndexes: [2, 3, 4, 5, 6, 7, 8]
      });
    });

  });

  describe.skip('getGapsWithDefaultSize', () => {
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

  describe.skip('getGapsFromScrollPages', () => {
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