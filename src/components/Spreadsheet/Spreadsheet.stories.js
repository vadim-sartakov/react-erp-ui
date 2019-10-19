import React, { useState } from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  SpreadsheetScroller,
  Spreadsheet,
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
for (let i = 1; i < 20; i++) {
  initialRows[i] = { level: 1 };
}
initialRows[0] = { isGroup: true };
initialRows[4] = { level: 1, isGroup: true };

for (let i = 5; i < 10; i++) {
  initialRows[i] = { level: 2 };
}

initialColumns[0] = { fixed: true };
initialColumns[1] = { fixed: true };

//initialRows[0] = { fixed: true };

//const initialScroll = { top: 5000, left: 0 };

const SpreadsheetComponent = () => {
  const [columns, setColumns] = useState([{ size: 50, fixed: true }, ...initialColumns]);
  const [rows, setRows] = useState([{ size: 25, fixed: true }, ...initialRows]);

  const {
    scroll,
    onScroll
  } = useSpreadsheet({ });
  
  return (
    <SpreadsheetScroller height={650} onScroll={onScroll}>
      <Spreadsheet
          scroll={scroll}
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
        <thead>
          <tr>
            <SpreadsheetTableCell header columnIndex={0} rowIndex={0}>
              <SpreadsheetCellValue rowIndex={0} className={classNames(classes.cellValue, classes.columnNumberCell)} />
            </SpreadsheetTableCell>
            {columns.slice(1, columns.length).map((column, columnIndex) => {
              return (
                <SpreadsheetTableCell
                    key={columnIndex}
                    header
                    columnIndex={columnIndex + 1}
                    rowIndex={0}>
                  <SpreadsheetCellValue rowIndex={0} className={classNames(classes.cellValue, classes.columnNumberCell)}>
                    {columnIndex + 1}
                    <SpreadsheetColumnResizer index={columnIndex + 1} className={classes.columnResizer} />
                  </SpreadsheetCellValue>
                </SpreadsheetTableCell>
              )
            })}
          </tr>
        </thead>

        <tbody>
          <SpreadsheetScrollableRows>
            {({ index: rowIndex, value: rowValue }) => {
              const row = rows[rowIndex + 1];
              const level = row && row.level;
              return (
                <tr key={rowIndex}>
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
                        <SpreadsheetCellValue className={classes.cellValue} rowIndex={rowIndex + 1} style={{ paddingLeft: level && columnIndex === 0 ? level * 15 : undefined }}>
                          {cellValue.value}
                        </SpreadsheetCellValue>
                      </SpreadsheetTableCell>
                    )
                  })}
                </tr>
              )
            }}
          </SpreadsheetScrollableRows>
        </tbody>
      </Spreadsheet>
    </SpreadsheetScroller>
  );
};

export const defaultComponent = () => <SpreadsheetComponent />;

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);