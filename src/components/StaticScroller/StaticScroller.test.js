import React from 'react';
import { shallow } from 'enzyme';
import StaticScroller from './StaticScroller';

describe.skip('StaticScroller', () => {

  describe('with default sizes and total counts', () => {

    it('renders page 0 and end paddings on initial scroll and flat source objects', () => {
      const children = jest.fn();
      const totalRows = {
        totalCount: 2
      };
      const totalColumns = {
        totalCount: 2
      };
      shallow((
        <StaticScroller
            totalRows={totalRows}
            totalColumns={totalColumns}
            defaultRowHeight={20}
            defaultColumnWidth={100}
            rowsPerPage={1}
            columnsPerPage={1}>
          {children}
        </StaticScroller>
      ));
      expect(children).toBeCalledTimes(1);
      const { rows, columns, rootStyle } = children.calls[0][0];

      expect(rows).toHaveProperty('pages');
      expect(rows).toHaveProperty('paddings', { start: 0, end: 20 });
      expect(columns).toHaveProperty('pages');
      expect(columns).toHaveProperty('paddings', { start: 0, end: 100 });

      expect(rootStyle).toEqual({
        marginTop: 0,
        merginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      });
    });

    it('renders page 1 and 2 with start and end paddings on non-zero scroll and flat source objects', () => {
      const children = jest.fn();
      const totalRows = {
        totalCount: 4
      };
      const totalColumns = {
        totalCount: 4
      };
      shallow((
        <StaticScroller
            totalRows={totalRows}
            totalColumns={totalColumns}
            defaultRowHeight={20}
            defaultColumnWidth={100}
            rowsPerPage={1}
            columnsPerPage={1}
            scrollTop={50}
            scrollLeft={250}>
          {children}
        </StaticScroller>
      ));
      expect(children).toBeCalledTimes(1);
      const { rows, columns, rootStyle } = children.calls[0][0];
      expect(rows).toHaveProperty('pages');
      expect(rows).toHaveProperty('paddings', { start: 20, end: 20 });
      expect(columns).toHaveProperty('pages');
      expect(columns).toHaveProperty('paddings', { start: 100, end: 100 });
      
      expect(rootStyle).toEqual({
        marginTop: -20,
        merginBottom: 0,
        marginLeft: -100,
        marginRight: 0
      });
    });

  });

  describe.skip('with specific sizes', () => {

    it('renders page 0 and end paddings with initial scroll, specific sizes and flat source objects', () => {
      const children = jest.fn();
      const rowHeights = [
        { size: 10 },
        { size: 20 }
      ];
      const columnsWidths = [
        { size: 80 },
        { size: 100 }
      ];
      shallow((
        <StaticScroller
            rowHeights={rowHeights}
            columnsWidths={columnsWidths}
            rowsPerPage={1}
            columnsPerPage={1}>
          {children}
        </StaticScroller>
      ));
      expect(children).toBeCalledTimes(1);
      const { rowsMeta, columnsMeta, rootStyle } = children.calls[0][0];
      expect(rowsMeta).toEqual({
        page: 0,
        children: [
          { size: 10 },
          { size: 20 }
        ]
      });
      expect(columnsMeta).toEqual({
        page: 0,
        children: [
          { size: 80 },
          { size: 100 }
        ]
      });
      expect(rootStyle).toEqual({
        marginLeft: -20,
        merginBottom: 20
      });
    });

  });

  describe.skip('mixed specific sizes and default sizes', () => {

  });
    
});