import React, { useState } from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import Spreadsheet, { SpreadsheetResizer, SpreadsheetCell } from './';
import { generateGridValues } from '../Scroller/Scroller.stories';
import classes from './Spreadsheet-stories.module.sass';

/**
 * @param {import('./').SpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {

  const [rows, onRowsChange] = useState(props.rows);
  const [columns, onColumnsChange] = useState(props.columns);

  const renderRowColumnNumbersIntersection = ({ row, column, columnIndex }) => (
    <SpreadsheetCell key={columnIndex} row={row} column={column} className={classes.columnNumberCell} />
  );

  const renderColumnNumber = ({ row, column, columnIndex }) => (
    <SpreadsheetCell
        key={columnIndex}
        row={row}
        column={column}
        className={classNames(
          classes.columnNumberCell,
          { [classes.lastFixedColumn]: columnIndex === props.fixColumns }
        )}>
      {columnIndex}
      <SpreadsheetResizer mode="column" index={columnIndex} column={column} className={classes.columnResizer} />
    </SpreadsheetCell>
  );

  const renderRowNumber = ({ row, column, rowIndex, columnIndex }) => (
    <SpreadsheetCell
        key={columnIndex}
        row={row}
        column={column}
        className={classNames(
          classes.rowNumberCell,
          { [classes.lastFixedRow]: rowIndex === props.fixRows }
        )}>
      {rowIndex}
      <SpreadsheetResizer mode="row" index={rowIndex} row={row} className={classes.rowResizer} />
    </SpreadsheetCell>
  );

  const renderCellValue = ({ row, rowIndex, columnIndex, column, rows, columns, value, mergedRange, overscrolled }) => (
    <SpreadsheetCell
        key={`${rowIndex}_${columnIndex}`}
        row={row}
        column={column}
        rows={rows}
        columns={columns}
        mergedRange={mergedRange}
        overscrolled={overscrolled}
        className={classNames(
          classes.cell,
          {
            [classes.lastFixedRow]: rowIndex === props.fixRows,
            [classes.lastFixedColumn]: columnIndex === props.fixColumns
          }
        )}>
      {value ? `Value ${value.row} - ${value.column}` : ''}
    </SpreadsheetCell>
  );

  return (
    <Spreadsheet
        {...props}
        rows={rows}
        onRowsChange={onRowsChange}
        columns={columns}
        onColumnsChange={onColumnsChange}
        className={classes.spreadsheet}
        renderRowColumnNumbersIntersection={renderRowColumnNumbersIntersection}
        renderColumnNumber={renderColumnNumber}
        renderRowNumber={renderRowNumber}
        renderCellValue={renderCellValue} />
  );
};

const defaultValue = generateGridValues(1000, 50);

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
      value={defaultValue}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

const valueWithMergedCells = generateGridValues(1000, 50);

/** @type {import('./').CellsRange[]} */
const mergedCells = [
  // Overlapping with all fixed areas
  /*{
    start: { row: 0, column: 0 },
    end: { row: 6, column: 6 }
  },
  // Overlapping with fixed rows area
  {
    start: { row: 0, column: 8 },
    end: { row: 6, column: 10 }
  },*/
  // Overlapping with fixed columns area
  {
    start: { row: 10, column: 0 },
    end: { row: 12, column: 8 }
  },
  // Not fixed area
  {
    start: { row: 20, column: 5 },
    end: { row: 25, column: 8 }
  },
  // Overscrolled not fixed area
  {
    start: { row: 30, column: 5 },
    end: { row: 150, column: 8 }
  }
];

export const withMergedCells = props => (
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
      value={valueWithMergedCells}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

const rowsGrouped = [];
for(let i = 1; i < 20; i++) {
  rowsGrouped[i] = { level: 1 };
}
for(let i = 5; i < 10; i++) {
  rowsGrouped[i] = { level: 2 };
}

export const withGroups = props => (
  <SpreadsheetComponent
      columnNumbersRowHeight={20}
      rowNumberColumnWidth={40}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={15}
      totalColumns={50}
      totalRows={1000}
      value={defaultValue}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      rows={rowsGrouped}
      {...props} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent)
  .add('merged cells', withMergedCells)
  .add('groups', withGroups);