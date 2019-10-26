import React from 'react';
import { storiesOf } from '@storybook/react';
import { loadPage } from './utils';
import { withScroller, ScrollContainer } from './';

export const generateMeta = count => {
  return [...new Array(count).keys()];
};

export const generateListValues = count => {
  return generateMeta(count).map(row => {
    return { row };
  });
};

export const generateGridValues = (rowsCount, columnsCount) => {
  return generateMeta(rowsCount).map(row => {
    return generateMeta(columnsCount).map(column => {
      return { row, column };
    });
  });
};

const generateCustomMeta = (count, size) => [...new Array(count).keys()].map(() => ({ size }));

export const listValue = generateListValues(1000);
const listRows = generateCustomMeta(listValue.length, 80);

export const ListTestComponent = withScroller(({
  visibleCells,
  rowsStartIndex,
  columnsStartIndex,
  ...props
}) => {
  return (
    <ScrollContainer
        height={600}
        className="scroller-container"
        coverProps={{ className: 'cover' }}
        pagesProps={{ className: 'pages' }}>
      {visibleCells.map((visibleRow, visibleRowIndex) => {
        const rowIndex = rowsStartIndex + visibleRowIndex;
        const height = (props.rows && props.rows[rowIndex].size) || props.defaultRowHeight;
        return (
          <div className="row" key={rowIndex} style={{ height }}>
            {visibleRow.isLoading ? 'Loading...' : `Value ${rowIndex}`}
          </div>
        );
      })}
    </ScrollContainer>
  )
});

export const gridValue = generateGridValues(1000, 50);
const gridRows = generateCustomMeta(gridValue.length, 60);
const gridColumns = generateCustomMeta(gridValue[0].length, 180);

export const GridTestComponent = withScroller(({
  visibleCells,
  rowsStartIndex,
  columnsStartIndex,
  ...props
}) => {
  return (
    <ScrollContainer
        width={800}
        height={600}
        className="scroller-container"
        coverProps={{ className: 'cover' }}
        pagesProps={{ className: 'pages' }}>
      {visibleCells.map((visibleRow, visibleRowIndex) => {
        const rowIndex = rowsStartIndex + visibleRowIndex;
        return (
          <div className="row" key={rowIndex} style={{ display: 'flex' }}>
            {visibleRow.map((visibleColumn, visibleColumnIndex) => {
              const columnIndex = columnsStartIndex + visibleColumnIndex;
              const height = (props.rows && props.rows[rowIndex].size) || props.defaultRowHeight;
              const width = (props.columns && props.columns[columnIndex].size) || props.defaultColumnWidth;
              return (
                <div className="cell" key={columnIndex} style={{ width, height }}>
                  {visibleColumn.isLoading ? 'Loading...' : `Value ${rowIndex} - ${columnIndex}`}
                </div>
              )
            })}
          </div>
        )
      })}
    </ScrollContainer>
  )
});

export const loadRowsPageSync = value => (page, itemsPerPage) => {
  console.log('Loading sync page %s', page);
  return loadPage(value, page, itemsPerPage);
};
export const loadRowsPageAsync = value => (page, itemsPerPage) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Loading async page %s', page);
      const result = loadPage(value, page, itemsPerPage);
      resolve(result);
    }, 1000);
  });
};

export const loadColumnsPage = (row, page, itemsPerPage) => loadPage(row, page, itemsPerPage);

export const syncListWithDefaultSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageSync(listValue)}
      {...props} />
);

export const syncListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageSync(listValue)}
      {...props} />
);

export const asyncListWithDefaultSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageAsync(listValue)}
      async
      {...props} />
);

export const asyncListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageAsync(listValue)}
      async
      {...props} />
);

export const syncGridWithDefaultSizes = props => (
  <GridTestComponent
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageSync(gridValue)}
      loadColumnsPage={loadColumnsPage}
      {...props} />
);

export const syncGridWithCustomSizes = props => (
  <GridTestComponent
      defaultRowHeight={40}
      defaultColumnWidth={150}
      rows={gridRows}
      columns={gridColumns}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageSync(gridValue)}
      loadColumnsPage={loadColumnsPage}
      {...props} />
);

export const asyncGridWithDefaultSizes = props => (
  <GridTestComponent
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageAsync(gridValue)}
      loadColumnsPage={loadColumnsPage}
      async
      {...props} />
);

export const asyncGridWithCustomSizes = props => (
  <GridTestComponent
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rows={gridRows}
      columns={gridColumns}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageAsync(gridValue)}
      loadColumnsPage={loadColumnsPage}
      async
      {...props} />
);

storiesOf('Scroller', module)
  .add('sync list with default row sizes', syncListWithDefaultSizes)
  .add('sync list with custom row sizes', syncListWithCustomSizes)
  .add('async list with default sizes', asyncListWithDefaultSizes)
  .add('async list with custom sizes', asyncListWithCustomSizes)
  .add('sync grid with default sizes', syncGridWithDefaultSizes)
  .add('sync grid with custom sizes', syncGridWithCustomSizes)
  .add('async grid with default sizes', asyncGridWithDefaultSizes)
  .add('async grid with custom sizes', asyncGridWithCustomSizes);