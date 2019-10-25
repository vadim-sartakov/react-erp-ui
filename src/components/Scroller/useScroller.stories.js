import React from 'react';
import { storiesOf } from '@storybook/react';
import { loadPage } from './utils';
import useScroller from './useScroller';

export const generateMeta = count => {
  return [...new Array(count).keys()];
};
export const generateGridValues = (rowsCount, columnsCount) => {
  return generateMeta(rowsCount).map(row => {
    return generateMeta(columnsCount).map(column => {
      return { row, column };
    })
  })
};

const generateCustomMeta = (count, size) => [...new Array(count).keys()].map(() => ({ size }));

export const gridValue = generateGridValues(1000, 50);
const gridRows = generateCustomMeta(gridValue.length, 60);
const gridColumns = generateCustomMeta(gridValue[0].length, 180);

export const GridTestComponent = props => {
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

export const loadRowsPageSync = (page, itemsPerPage) => {
  console.log('Loading sync page %s', page);
  return loadPage(gridValue, page, itemsPerPage);
};
export const loadRowsPageAsync = (page, itemsPerPage) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Loading async page %s', page);
      const result = loadPage(gridValue, page, itemsPerPage);
      resolve(result);
    }, 1000);
  });
};

export const loadColumnsPage = (row, page, itemsPerPage) => loadPage(row, page, itemsPerPage);

export const syncListWithDefaultRowSizes = props => (
  <GridTestComponent
      scrollHeight={600}
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageSync}
      {...props} />
);

export const syncGridWithDefaultSizes = props => (
  <GridTestComponent
      scrollHeight={600}
      scrollWidth={800}
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageSync}
      loadColumnsPage={loadColumnsPage}
      {...props} />
);

export const syncGridWithCustomSizes = props => (
  <GridTestComponent
      scrollHeight={600}
      scrollWidth={800}
      defaultRowHeight={40}
      defaultColumnWidth={150}
      rows={gridRows}
      columns={gridColumns}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageSync}
      loadColumnsPage={loadColumnsPage}
      {...props} />
);

export const asyncGridWithDefaultSizes = props => (
  <GridTestComponent
      scrollHeight={600}
      scrollWidth={800}
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageAsync}
      loadColumnsPage={loadColumnsPage}
      async
      {...props} />
);

export const asyncGridWithCustomSizes = props => (
  <GridTestComponent
      scrollHeight={600}
      scrollWidth={800}
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rows={gridRows}
      columns={gridColumns}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageAsync}
      loadColumnsPage={loadColumnsPage}
      async
      {...props} />
);

storiesOf('Scroller', module)
  .add('sync list with default row sizes', syncListWithDefaultRowSizes)
  .add('sync grid with default sizes', syncGridWithDefaultSizes)
  .add('sync grid with custom sizes', syncGridWithCustomSizes)
  .add('async grid with default sizes', asyncGridWithDefaultSizes)
  .add('async grid with custom sizes', asyncGridWithCustomSizes);