import React from 'react';
import { storiesOf } from '@storybook/react';
import { loadPage } from './utils';
import Scroller, { ScrollerCell } from './';
import { generateListValues, generateGridValues } from '../test-utils/generateValues';
import classes from './Scroller-stories.module.sass';

export const generateCustomMeta = (count, size) => [...new Array(count).keys()].map(() => ({ size }));

export const listValue = generateListValues(1000);
const listRows = generateCustomMeta(listValue.length, 80);

/** @type {import('react').FunctionComponent<import('.').ScrollerCellProps>} */
const ListCellComponent = ({ row, value }) => (
  <ScrollerCell className="row" row={row}>
    {value ? `Value ${value.row}` : 'Loading...'}
  </ScrollerCell>
);

/** @type {import('react').FunctionComponent<import('.').ScrollerProps>} */
export const ListTestComponent = props => {
  return <Scroller CellComponent={ListCellComponent} height={600} {...props} />;
};

export const gridValue = generateGridValues(1000, 50);
const gridRows = generateCustomMeta(gridValue.length, 60);
const gridColumns = generateCustomMeta(gridValue[0].length, 180);

/** @type {import('react').FunctionComponent<import('.').ScrollerCellProps>} */
const GridCellComponent = ({ rowIndex, columnIndex, row, column, value }) => (
  <ScrollerCell className={classes.cell} rowIndex={rowIndex} columnIndex={columnIndex} row={row} column={column}>
    {value ? `Value ${value.row} - ${value.column}` : 'Loading...'}
  </ScrollerCell>
);

/** @type {import('react').FunctionComponent<import('.').ScrollerProps>} */
export const GridTestComponent = props => {
  return <Scroller CellComponent={GridCellComponent} width={800} height={600} {...props} />;
};

export const loadPageAsync = value => (page, itemsPerPage) => {
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
      loadPage={loadPageAsync(listValue)}
      lazy
      {...props} />
);

export const asyncLazyListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      loadPage={loadPageAsync(listValue)}
      lazy
      {...props} />
);

export const syncListWithDefaultSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      value={listValue}
      {...props} />
);

export const syncListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      value={listValue}
      {...props} />
);

export const asyncListWithDefaultSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rowsPerPage={30}
      loadPage={loadPageAsync(listValue)}
      {...props} />
);

export const asyncListWithCustomSizes = props => (
  <ListTestComponent
      defaultRowHeight={40}
      totalRows={gridValue.length}
      rows={listRows}
      rowsPerPage={30}
      loadPage={loadPageAsync(listValue)}
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
      value={gridValue}
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
      value={gridValue}
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
      value={gridValue}
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
      value={gridValue}
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
      loadPage={loadPageAsync(gridValue)}
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
      loadPage={loadPageAsync(gridValue)}
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