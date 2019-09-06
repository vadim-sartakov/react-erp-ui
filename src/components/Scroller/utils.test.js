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
      const result = getScrollPages(meta, 20, 1);
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
      const result = getScrollPages(meta, 20, 1);
      expect(result).toEqual([
        { start: 0, end: 20 },
        { start: 20, end: 80 },
        { start: 80, end: 100 }
      ]);
    });

    it('second page should be with longer scroll range when custom size specified', () => {
      const meta = {
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
        children: [
          {},
          {
            size: 40,
            expanded: true,
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
        children: [
          {},
          {
            size: 40,
            expanded: true,
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

});