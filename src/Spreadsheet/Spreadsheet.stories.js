import React, { useState, useCallback } from 'react';
import { storiesOf } from '@storybook/react';
import Spreadsheet from './';
import { generateGridValues } from '../test-utils/generateValues';
import exportToExcel from './exportToExcel';
import classes from './Spreadsheet-stories.module.sass';

const gridValuesMapper = valueRow => {
  if (!valueRow) return;
  return valueRow.map(cellValue => {
    return {
      value: cellValue
    };
  });
};

const spreadsheetValues = generateGridValues(1000, 50).map(gridValuesMapper);

const CellComponent = ({ value }) => (
  <div className={classes.cell}>
    {value ? value.value : ''}
  </div>
);

/**
 * @type {import('react').FunctionComponent<import('.').SpreadsheetProps>}
 */
const SpreadsheetComponent = props => {

  const [rows, onRowsChange] = useState(props.rows);
  const [columns, onColumnsChange] = useState(props.columns);

  const handleExportToExcel = useCallback(() => {
    exportToExcel({
      value: props.value,
      rows: rows,
      columns: columns,
      mergedCells: props.mergedCells,
      totalRows: props.totalRows,
      totalColumns: props.totalColumns,
      fixRows: props.fixRows,
      fixColumns: props.fixColumns,
      defaultRowHeight: props.defaultRowHeight,
      defaultColumnWidth: props.defaultColumnWidth
    }, 'export.xlsx');
  }, [
    props.value,
    columns,
    rows,
    props.mergedCells,
    props.totalRows,
    props.totalColumns,
    props.fixRows,
    props.fixColumns,
    props.defaultRowHeight,
    props.defaultColumnWidth
  ]);

  return (
    <div>
      <Spreadsheet
        {...props}
        rows={rows}
        onRowsChange={onRowsChange}
        columns={columns}
        onColumnsChange={onColumnsChange}
        className={classes.spreadsheet}
        CellComponent={CellComponent} />
      <button className={classes.exportButton} onClick={handleExportToExcel}>
        Export to Excel
      </button>
    </div>
  );
};

export const defaultComponent = props => (
  <SpreadsheetComponent
      columnNumbersRowHeight={20}
      rowNumberColumnWidth={40}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={15}
      totalColumns={50}
      totalRows={1000}
      value={spreadsheetValues}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

export const withMergedCells = props => {
  /** @type {import('./').CellsRange[]} */
  const mergedCells = [
    // Overlapping with all fixed areas
    {
      start: { row: 0, column: 0 },
      end: { row: 3, column: 3 }
    },
    // Overlapping with fixed rows area
    {
      start: { row: 0, column: 8 },
      end: { row: 5, column: 9 }
    },
    // Overlapping with fixed columns area
    {
      start: { row: 10, column: 0 },
      end: { row: 11, column: 30 }
    },
    // Not fixed area
    {
      start: { row: 20, column: 5 },
      end: { row: 25, column: 7 }
    },
    // Overscrolled not fixed area
    {
      start: { row: 30, column: 5 },
      end: { row: 150, column: 7 }
    },

    // Overscrolled fixed columns area
    {
      start: { row: 14, column: 0 },
      end: { row: 150, column: 0 }
    },
    // Overscrolled fixed rows area
    {
      start: { row: 0, column: 12 },
      end: { row: 1, column: 30 }
    }
  ];
  return (
    <SpreadsheetComponent
        columnNumbersRowHeight={20}
        rowNumberColumnWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        mergedCells={mergedCells}
        value={spreadsheetValues}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        {...props} />
  )
};

export const withGroups = props => {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows[i] = { level: 1 };
  }
  for (let i = 5; i < 10; i++) {
    rows[i] = { level: 2 };
  }
  for (let i = 15; i < 20; i++) {
    rows[i] = { level: 2 };
  }

  for (let i = 30; i < 50; i++) {
    rows[i] = { level: 1 };
  }
  for (let i = 35; i < 40; i++) {
    rows[i] = { level: 2 };
  }
  for (let i = 45; i < 50; i++) {
    rows[i] = { level: 2 };
  }

  const columns = [];
  for (let i = 0; i < 10; i++) {
    columns[i] = { level: 1 };
  }
  for (let i = 2; i < 5; i++) {
    columns[i] = { level: 2 };
  }
  for (let i = 6; i < 10; i++) {
    columns[i] = { level: 2 };
  }

  for (let i = 12; i < 20; i++) {
    columns[i] = { level: 1 };
  }
  for (let i = 14; i < 16; i++) {
    columns[i] = { level: 2 };
  }
  for (let i = 19; i < 20; i++) {
    columns[i] = { level: 2 };
  }

  return (
    <SpreadsheetComponent
        columnNumbersRowHeight={20}
        rowNumberColumnWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        value={spreadsheetValues}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        rows={rows}
        columns={columns}
        groupSize={20}
        {...props} />
  )
};

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent)
  .add('merged cells', withMergedCells)
  .add('groups', withGroups);