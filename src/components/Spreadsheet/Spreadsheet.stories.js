import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  Spreadsheet,
  SpreadsheetRow,
  SpreadsheetCell,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer
} from './';
import { useScroller, Scroller } from '../Scroller';
import classes from './Spreadsheet-stories.module.sass';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ width: 200 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return rowColumns;
  });
};

const columns = generateColumns(15);
const value = generateValues(columns, 1000);

const rows = [];
for (let i = 5; i < 100; i++) {
  rows[i] = { level: 1 };
}
for (let i = 20; i < 50; i++) {
  rows[i] = { level: 2 };
}

//const initialScroll = { top: 5000, left: 0 };

/**
 * @param {import('../Scroller/useScroller').useScrollerProps | import('./useSpreadsheet').useSpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {
  const {
    value,
    rows,
    columns,
    ...spreadsheetProps
  } = useSpreadsheet(props);

  const {
    visibleCells,
    rowsStartIndex,
    columnsStartIndex,
    scrollerProps
  } = useScroller({
    ...props,
    value
  });

  return (
    <Spreadsheet
        {...spreadsheetProps}
        className={classes.root}
        classes={{
          fixed: classes.fixed,
          lastFixedRowCell: classes.lastFixedRowCell,
          lastFixedColumnCell: classes.lastFixedColumnCell
        }}>
      
      <Scroller height={600} {...scrollerProps}>
        {visibleCells.map((visibleRow, visibleRowIndex) => {
          const rowIndex = rowsStartIndex + visibleRowIndex;
          return (
            <SpreadsheetRow key={rowIndex} index={rowIndex}>
              {visibleRow.map((visibleColumn, visibleColumnIndex) => {
                const columnIndex = columnsStartIndex + visibleColumnIndex;
                return (
                  <SpreadsheetCell index={columnIndex} className={classNames(classes.cell)}>
                    <SpreadsheetColumnResizer index={columnIndex + 1} className={classes.columnResizer} />
                  </SpreadsheetCell>
                );
              })}
            </SpreadsheetRow>
          )
        })}
      </Scroller>

      <SpreadsheetRow index={0}>
        <SpreadsheetCell index={0}>
          <SpreadsheetCellValue rowIndex={0} className={classNames(classes.cellValue, classes.columnNumberCell)} />
        </SpreadsheetCell>
        {columns.slice(1, columns.length).map((column, columnIndex) => {
          return (
            <SpreadsheetTableCell
                key={columnIndex}
                columnIndex={columnIndex + 1}
                rowIndex={0}>
              <SpreadsheetCellValue rowIndex={0} className={classNames(classes.cellValue, classes.columnNumberCell)}>
                {columnIndex + 1}
                <SpreadsheetColumnResizer index={columnIndex + 1} className={classes.columnResizer} />
              </SpreadsheetCellValue>
            </SpreadsheetTableCell>
          )
        })}
      </SpreadsheetRow>

      <div>
        <SpreadsheetScrollableRows>
          {({ index: rowIndex, value: rowValue }) => {
            const row = rows[rowIndex + 1];
            const level = row && row.level;
            return (
              <SpreadsheetTableRow key={rowIndex} rowIndex={rowIndex + 1}>
                <SpreadsheetTableCell rowIndex={rowIndex + 1} columnIndex={0}>
                  <SpreadsheetCellValue rowIndex={rowIndex + 1} className={classNames(classes.cellValue, classes.rowNumberCell)}>
                    {rowIndex + 1}
                    <SpreadsheetRowResizer index={rowIndex + 1} className={classes.rowResizer} />
                  </SpreadsheetCellValue>
                </SpreadsheetTableCell>
                {columns.slice(1, columns.length).map((column, columnIndex) => {
                  const cellValue = rowValue[columnIndex];
                  return (
                    <SpreadsheetTableCell key={columnIndex + 1} rowIndex={rowIndex + 1} columnIndex={columnIndex + 1}>
                      <SpreadsheetCellValue rowIndex={rowIndex + 1} className={classes.cellValue} style={{ paddingLeft: level && columnIndex === 0 ? level * 15 : undefined }}>
                        {cellValue.value}
                      </SpreadsheetCellValue>
                    </SpreadsheetTableCell>
                  )
                })}
              </SpreadsheetTableRow>
            )
          }}
        </SpreadsheetScrollableRows>
      </div>
    </Spreadsheet>
  );
};

export const defaultComponent = () => (
  <SpreadsheetComponent
      value={value}
      rows={rows}
      columns={columns}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={10} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);