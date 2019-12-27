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

  const renderCellValue = ({ row, rowIndex, columnIndex, column, value, columns, rows }) => (
    <SpreadsheetCell
        key={`${rowIndex}_${columnIndex}`}
        row={row}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        column={column}
        columns={columns}
        rows={rows}
        value={value}
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
valueWithMergedCells[0][0] = { ...valueWithMergedCells[0][0], colSpan: 2, rowSpan: 2 };
valueWithMergedCells[0][4] = { ...valueWithMergedCells[0][4], colSpan: 6, rowSpan: 2 };
valueWithMergedCells[5][0] = { ...valueWithMergedCells[5][0], colSpan: 2, rowSpan: 6 };
valueWithMergedCells[20][5] = { ...valueWithMergedCells[20][5], colSpan: 4, rowSpan: 3 };

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