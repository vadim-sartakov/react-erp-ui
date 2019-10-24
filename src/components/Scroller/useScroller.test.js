import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import useScroller from './useScroller';
import { loadPage } from './utils';

export const generateMeta = count => {
  return [...new Array(count).keys()];
};
export const generateValues = (rowsCount, columnsCount) => {
  return generateMeta(rowsCount).map(row => {
    return generateMeta(columnsCount).map(column => {
      return { row, column };
    })
  })
};

export const TestComponent = props => {
  const {
    onScroll,
    visibleCells,
    rowsStartIndex,
    columnsStartIndex,
    scrollerStyles,
    pagesStyles
  } = useScroller(props);
  return (
    <div className="scroller-container" onScroll={onScroll} style={scrollerStyles}>
      <div className="pages" style={pagesStyles}>
        {visibleCells.map((visibleRow, index) => {
          const rowIndex = rowsStartIndex + index;
          return (
            <div className="row" key={rowIndex}>
              {visibleRow.map((visibleColumn, index) => {
                const columnIndex = columnsStartIndex + index;
                return (
                  <div className="cell" key={columnIndex}>
                    {JSON.stringify({ rowIndex, columnIndex, ...visibleColumn })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
};

describe('useScroller', () => {

  describe('sync', () => {

    it('should load initial page with default sizes', () => {
      const value = generateValues(100, 10);
      const loadRowsPage = jest.fn((page, itemsPerPage) => loadPage(value, page, itemsPerPage));
      const loadColumnsPage = jest.fn((row, page, itemsPerPage) => loadPage(row, page, itemsPerPage));
      const wrapper = shallow((
        <TestComponent
            defaultRowHeight={50}
            defaultColumnWidth={100}
            totalRows={100}
            totalColumns={10}
            rowsPerPage={10}
            columnsPerPage={5}
            loadRowsPage={loadRowsPage}
            loadColumnsPage={loadColumnsPage} />
      ));
      expect(wrapper.find('.row').length).toBe(20);
    });

  });

});