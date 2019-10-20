import React, { useState } from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  SpreadsheetScroller,
  Spreadsheet,
  SpreadsheetTableRow,
  SpreadsheetTableCell,
  SpreadsheetScrollableRows,
  SpreadsheetCellValue,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer
} from './';
import classes from './Spreadsheet-stories.module.sass';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}`, width: 200 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return rowColumns;
  });
};

const initialColumns = generateColumns(15);
const data = generateValues(initialColumns, 1000);

const initialRows = [];
for (let i = 5; i < 100; i++) {
  initialRows[i] = { level: 1 };
}
initialRows[0] = { fixed: true };
initialRows[1] = { fixed: true };

for (let i = 20; i < 50; i++) {
  initialRows[i] = { level: 2 };
}

initialColumns[0] = { fixed: true };
initialColumns[1] = { fixed: true };

//const initialScroll = { top: 5000, left: 0 };

const SpreadsheetComponent = () => {
  const [columns, setColumns] = useState([{ size: 50, fixed: true, special: true }, ...initialColumns]);
  const [rows, setRows] = useState([{ size: 25, fixed: true, special: true }, ...initialRows]);

  const {
    scroll,
    onScroll
  } = useSpreadsheet({ });
  
  return (
    <SpreadsheetScroller height={650} scroll={scroll} onScroll={onScroll}>
      <Spreadsheet
          columns={columns}
          onColumnsChange={setColumns}
          rows={rows}
          onRowsChange={setRows}
          data={data}
          className={classes.root}
          defaultColumnWidth={120}
          defaultRowHeight={25}
          rowsPerPage={60}
          classes={{
            fixed: classes.fixed,
            lastFixedRowCell: classes.lastFixedRowCell,
            lastFixedColumnCell: classes.lastFixedColumnCell
          }}>
        <SpreadsheetTableRow rowIndex={0}>
            <SpreadsheetTableCell columnIndex={0} rowIndex={0}>
              <SpreadsheetCellValue rowIndex={0} className={classNames(classes.cellValue, classes.columnNumberCell)} />
            </SpreadsheetTableCell>
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
          </SpreadsheetTableRow>

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
    </SpreadsheetScroller>
  );
};

export const defaultComponent = () => <SpreadsheetComponent />;

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);