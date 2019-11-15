import React from 'react';
import { storiesOf } from '@storybook/react';
import { loadPage } from './utils';
import { useScroller, Scroller, ScrollerCell } from './';

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

export const generateCustomMeta = (count, size) => [...new Array(count).keys()].map(() => ({ size }));

export const listValue = generateListValues(1000);
const listRows = generateCustomMeta(listValue.length, 80);

export const ListTestComponent = props => {
  const {
    rows,
    visibleRows,
    visibleValues,
    scrollerProps
  } = useScroller(props);
  return (
    <Scroller
        {...scrollerProps}
        height={600}
        className="scroller-container"
        coverProps={{ className: 'cover' }}
        pagesProps={{ className: 'pages' }}>
      {visibleRows.map(visibleRow => {
        const row = rows && rows[visibleRow];
        const visibleValue = visibleValues[visibleRow];
        return (
          <ScrollerCell className="row" key={visibleRow} row={row} index={visibleRow}>
            {visibleValue.isLoading ? 'Loading...' : `Value ${visibleValue.row}`}
          </ScrollerCell>
        );
      })}
    </Scroller>
  )
};

export const gridValue = generateGridValues(1000, 50);
const gridRows = generateCustomMeta(gridValue.length, 60);
const gridColumns = generateCustomMeta(gridValue[0].length, 180);

/**
 * @param {import('./useScroller').useScrollerProps} props 
 */
export const GridTestComponent = props => {
  const {
    rows,
    columns,
    visibleRows,
    visibleColumns,
    visibleValues,
    gridStyles,
    scrollerProps
  } = useScroller(props);
  return (
    <Scroller
        {...scrollerProps}
        width={800}
        height={600}
        className="scroller-container"
        coverProps={{ className: 'cover' }}
        pagesProps={{ className: 'pages' }}>
      <div style={gridStyles}>
        {visibleRows.reduce((acc, visibleRow) => {
          const row = rows && rows[visibleRow];
          const columnsElements = visibleColumns.map(visibleColumn => {
            const column = columns && columns[visibleColumn];
            const visibleValue = visibleValues[visibleRow][visibleColumn];
            return (
              <ScrollerCell
                  className="cell"
                  key={visibleColumn}
                  row={row}
                  column={column}
                  style={{ backgroundColor: '#fff', borderBottom: 'solid 1px grey', borderRight: 'solid 1px grey' }}>
                {visibleValue.isLoading ? 'Loading...' : `Value ${visibleValue.row} - ${visibleValue.column}`}
              </ScrollerCell>
            )
          });
          return [acc, ...columnsElements];
        }, [])}
      </div>
    </Scroller>
  )
};

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

export const asyncLazyListWithDefaultSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageAsync(listValue)}
      async
      lazy
      {...props} />
);

export const asyncLazyListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      loadRowsPage={loadRowsPageAsync(listValue)}
      async
      lazy
      {...props} />
);

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
      {...props} />
);

export const syncGridWithDefaultSizesAndFixedRowsColumns = props => (
  <GridTestComponent
      defaultRowHeight={40}
      defaultColumnWidth={150}
      totalRows={gridValue.length}
      totalColumns={gridValue[0].length}
      rowsPerPage={30}
      columnsPerPage={10}
      loadRowsPage={loadRowsPageSync(gridValue)}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

export const syncGridWithCustomSizesAndFixedRowsColumns = props => (
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
      fixRows={2}
      fixColumns={2}
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
      async
      {...props} />
);

storiesOf('Scroller', module)
  .add('async lazy list with default row sizes', asyncLazyListWithDefaultSizes)
  .add('async lazy list with custom row sizes', asyncLazyListWithCustomSizes)
  .add('sync list with default row sizes', syncListWithDefaultSizes)
  .add('sync list with custom row sizes', syncListWithCustomSizes)
  .add('async list with default sizes', asyncListWithDefaultSizes)
  .add('async list with custom sizes', asyncListWithCustomSizes)
  .add('sync grid with default sizes', syncGridWithDefaultSizes)
  .add('sync grid with custom sizes', syncGridWithCustomSizes)
  .add('sync grid with default sizes and fixed rows columns', syncGridWithDefaultSizesAndFixedRowsColumns)
  .add('sync grid with custom sizes and fixed rows columns', syncGridWithCustomSizesAndFixedRowsColumns)
  .add('async grid with default sizes', asyncGridWithDefaultSizes)
  .add('async grid with custom sizes', asyncGridWithCustomSizes);