import React from 'react';
import { storiesOf } from '@storybook/react';
import { loadPage } from './utils';
import useScroller from './useScroller';

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

const value = generateValues(100, 50);

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
            <div className="row" key={rowIndex} style={{ display: 'flex' }}>
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

const loadRowsPage = (page, itemsPerPage) => loadPage(value, page, itemsPerPage);
const loadColumnsPage = (row, page, itemsPerPage) => loadPage(row, page, itemsPerPage);

storiesOf('Scroller', module)
  .add('default', () => (
    <TestComponent
        scrollHeight={600}
        scrollWidth={600}
        defaultRowHeight={50}
        defaultColumnWidth={100}
        totalRows={100}
        totalColumns={10}
        rowsPerPage={10}
        columnsPerPage={5}
        loadRowsPage={loadRowsPage}
        loadColumnsPage={loadColumnsPage} />
  ));