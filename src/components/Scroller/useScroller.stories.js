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

const value = generateValues(1000, 50);

export const TestComponent = props => {
  const {
    onScroll,
    visibleCells,
    rowsStartIndex,
    columnsStartIndex,
    scrollerStyles,
    coverStyles,
    pagesStyles
  } = useScroller(props);
  return (
    <div className="scroller-container" onScroll={onScroll} style={scrollerStyles}>
      <div className="cover" style={coverStyles}>
        <div className="pages" style={pagesStyles}>
          {visibleCells.map((visibleRow, index) => {
            const rowIndex = rowsStartIndex + index;
            return (
              <div className="row" key={rowIndex} style={{ display: 'flex' }}>
                {visibleRow.map((visibleColumn, index) => {
                  const columnIndex = columnsStartIndex + index;
                  return (
                    <div className="cell" key={columnIndex} style={{ width: props.defaultColumnWidth, height: props.defaultRowHeight }}>
                      {`Value ${rowIndex} - ${columnIndex}`}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
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
        scrollWidth={800}
        defaultRowHeight={40}
        defaultColumnWidth={150}
        totalRows={value.length}
        totalColumns={value[0].length}
        rowsPerPage={20}
        columnsPerPage={10}
        loadRowsPage={loadRowsPage}
        loadColumnsPage={loadColumnsPage} />
  ));