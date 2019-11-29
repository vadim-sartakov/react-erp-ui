import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import Spreadsheet, { SpreadsheetResizer, SpreadsheetCell } from './';
import { generateGridValues } from '../Scroller/Scroller.stories';
import classes from './Spreadsheet-stories.module.sass';

export const value = generateGridValues(1000, 50);
// FIxed cells
value[0][0] = { ...value[0][0], colSpan: 2, rowSpan: 2 };
value[0][4] = { ...value[0][4], colSpan: 6, rowSpan: 2 };
value[5][0] = { ...value[5][0], colSpan: 2, rowSpan: 6 };
value[50][5] = { ...value[50][5], colSpan: 4, rowSpan: 3 };

/*for (let i = 5; i < 100; i++) {
  rows[i] = { level: 1 };
}
for (let i = 20; i < 50; i++) {
  rows[i] = { level: 2 };
}*/

//const initialScroll = { top: 5000, left: 0 };

/**
 * @param {import('../Scroller/useScroller').useScrollerOptions | import('./useSpreadsheet').useSpreadsheetOptions} props 
 */
const SpreadsheetComponent = props => {

  const renderIntersectionColumn = ({ row, column, columnIndex }) => (
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
        className={classes.spreadsheet}
        renderIntersectionColumn={renderIntersectionColumn}
        renderColumnNumber={renderColumnNumber}
        renderRowNumber={renderRowNumber}
        renderCellValue={renderCellValue} />
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
      value={value}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);