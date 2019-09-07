import {
  getScrollPages,
  getPageNumberFromScrollPages,
  shiftScrollPages,
  getPageNumberWithDefaultSize,
  getGapsWithDefaultSize
} from './utils';

describe('Scroller utils', () => {
  
  describe('getScrollPages', () => {

    it('expanded second item should be bigger', () => {
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 60 },
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 80 },
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 60 },
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 80 },
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 100 },
        { start: 100, end: 120 }
      ]);
    });

  });

  describe('shiftScrollPages', () => {
    const scrollPages = [
      { start: 0, end: 20 },
      { start: 20, end: 60 },
      { start: 60, end: 80 }
    ]
    expect(shiftScrollPages(scrollPages)).toEqual([
      { start: 0, end: 10 },
      { start: 10, end: 40 },
      { start: 40, end: 70 }
    ]);
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

  describe.skip('getGapsWithDefaultSize', () => {
    it('should return gaps start: 0, end: 100 when arguments defaultSize: 20, itemsPerPage: 1, totalCount: 2, page: 0', () => {
      expect(getGapsWithDefaultSize({ defaultSize: 20, itemsPerPage: 1, totalCount: 2, page: 0 })).toEqual({ start: 0, end: 100 });
    });
  })

});