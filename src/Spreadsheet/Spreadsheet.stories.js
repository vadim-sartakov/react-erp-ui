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

const CellComponent = ({ cell, style }) => (
  <div className={classes.cell} style={style}>
    {cell ? cell.value : ''}
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
      cells: props.cells,
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
    props.cells,
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

export const defaultComponent = props => {
  const value = generateGridValues(1000, 50).map(gridValuesMapper);
  return (
    <SpreadsheetComponent
        columnHeadingHeight={20}
        rowHeadingWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        cells={value}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        {...props} />
  )
};

export const withMergedCells = props => {
  const value = generateGridValues(1000, 50).map(gridValuesMapper);

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
        columnHeadingHeight={20}
        rowHeadingWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        mergedCells={mergedCells}
        cells={value}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        {...props} />
  )
};

export const withGroups = props => {
  const value = generateGridValues(1000, 50).map(gridValuesMapper);

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
        columnHeadingHeight={20}
        rowHeadingWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        cells={value}
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

const withStyles = props => {
  /** @type {import('./').Cell[][]} */
  const value = generateGridValues(100, 20).map(gridValuesMapper);
  for(let i = 0; i < 20; i++) {
    value[0][i].style = {
      border: {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      },
      fill: '#2a7b29'
    };
    
  }

  const mergedCells = [
    {
      start: { row: 5, column: 2 },
      end: { row: 10, column: 5 }
    }
  ];

  value[5][2].style = {
    fill: '#f1f1f1',
    border: {
      top: { style: 'thick', color: '#008222' },
      left: { style: 'thick', color: '#008222' },
      bottom: { style: 'thick', color: '#008222' },
      right: { style: 'thick', color: '#008222' }
    },
    font: {
      color: '#008222',
      italic: true
    }
  };

  value[15][2].style = {
    fill: '#f1f1f1',
    border: {
      top: { style: 'medium', color: '#008222' },
      left: { style: 'medium', color: '#008222' },
      bottom: { style: 'medium', color: '#008222' },
      right: { style: 'medium', color: '#008222' }
    }
  };

  /** @type {import('./').Meta[]} */
  const rows = [];
  rows[0] = {
    style: {
      font: {
        size: 18,
        bold: true,
        color: '#fff'
      },
      horizontalAlign: 'center',
      verticalAlign: 'middle'
    },
    size: 30
  };

  /** @type {import('./').Meta[]} */
  const columns = [];
  columns[0] = {
    style: {
      horizontalAlign: 'right'
    },
    size: 50
  };
  columns[1] = {
    size: 50,
    style: {
      wrapText: true
    }
  }
  return (
    <SpreadsheetComponent
        columnHeadingHeight={20}
        rowHeadingWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        cells={value}
        rows={rows}
        columns={columns}
        width={800}
        height={600}
        fixRows={1}
        fixColumns={0}
        mergedCells={mergedCells}
        {...props} />
  )
};

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent)
  .add('merged cells', withMergedCells)
  .add('groups', withGroups)
  .add('withStyles', withStyles);