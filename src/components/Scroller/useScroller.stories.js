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
          {visibleCells.map((visibleRow, visibleRowIndex) => {
            const rowIndex = rowsStartIndex + visibleRowIndex;
            return (
              <div className="row" key={rowIndex} style={{ display: 'flex' }}>
                {visibleRow.map((visibleColumn, visibleColumnIndex) => {
                  const columnIndex = columnsStartIndex + visibleColumnIndex;
                  const cellValue = visibleCells[visibleRowIndex][visibleColumnIndex];
                  const height = (props.rows && props.rows[rowIndex].size) || props.defaultRowHeight;
                  const width = (props.columns && props.columns[columnIndex].size) || props.defaultColumnWidth;
                  return (
                    <div className="cell" key={columnIndex} style={{ width, height }}>
                      {cellValue.isLoading ? 'Loading...' : `Value ${rowIndex} - ${columnIndex}`}
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

const loadRowsPageSync = (page, itemsPerPage) => {
  console.log('Loading sync page %s', page);
  return loadPage(value, page, itemsPerPage);
};
const loadRowsPageAsync = (page, itemsPerPage) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Loading async page %s', page);
      const result = loadPage(value, page, itemsPerPage);
      resolve(result);
    }, 1000);
  });
};

const loadColumnsPage = (row, page, itemsPerPage) => loadPage(row, page, itemsPerPage);

storiesOf('Scroller', module)
  .add('sync with default sizes', () => (
    <TestComponent
        scrollHeight={600}
        scrollWidth={800}
        defaultRowHeight={40}
        defaultColumnWidth={150}
        totalRows={value.length}
        totalColumns={value[0].length}
        rowsPerPage={30}
        columnsPerPage={10}
        loadRowsPage={loadRowsPageSync}
        loadColumnsPage={loadColumnsPage} />
  ))
  .add('sync custom sizes', () => (
    <TestComponent
        scrollHeight={600}
        scrollWidth={800}
        defaultRowHeight={40}
        defaultColumnWidth={150}
        rows={[...new Array(value.length).keys()].map(key => ({ size: 60 }))}
        columns={[...new Array(value[0].length).keys()].map(key => ({ size: 180 }))}
        totalRows={value.length}
        totalColumns={value[0].length}
        rowsPerPage={30}
        columnsPerPage={10}
        loadRowsPage={loadRowsPageSync}
        loadColumnsPage={loadColumnsPage} />
  ))
  .add('async with default sizes', () => (
    <TestComponent
        scrollHeight={600}
        scrollWidth={800}
        defaultRowHeight={40}
        defaultColumnWidth={150}
        totalRows={value.length}
        totalColumns={value[0].length}
        rowsPerPage={30}
        columnsPerPage={10}
        loadRowsPage={loadRowsPageAsync}
        loadColumnsPage={loadColumnsPage}
        async />
  ));