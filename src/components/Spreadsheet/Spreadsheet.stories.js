import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetTableHeaderCell,
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

const columns = generateColumns(15);
const data = generateValues(columns, 1000);

const rows = [];
for (let i = 100; i < 200; i++) {
  rows[i] = { level: 1 };
}

for (let i = 120; i < 170; i++) {
  rows[i] = { level: 2 };
}

const SpreadsheetComponent = () => {
  const [columnsValue, setColumnsValue] = useState(columns);
  const [rowsValue, setRowsValue] = useState(rows);
  return (
    <Spreadsheet
        columns={columnsValue}
        onColumnsChange={setColumnsValue}
        rows={rowsValue}
        onRowsChange={setRowsValue}
        data={data}
        className={classes.root}
        defaultColumnWidth={120}
        height={650}
        defaultRowHeight={16}
        rowVerticalPadding={4}
        rowBorderHeight={1}
        rowsPerPage={60}>
      <thead>
        <tr style={{ height: 20 }}>
          <th style={{ width: 50 }} />
          {columns.map((column, columnIndex) => {
            return (
              <SpreadsheetTableHeaderCell key={columnIndex} index={columnIndex}>
                {columnIndex + 1}
                <SpreadsheetColumnResizer index={columnIndex} className={classes.columnResizer} />
              </SpreadsheetTableHeaderCell>
            )
          })}
        </tr>
      </thead>

      <tbody>
        <SpreadsheetScrollableRows>
          {({ index: rowIndex, value: rowValue }) => {
            const row = rows[rowIndex];
            const level = row && row.level;
            return (
              <tr key={rowIndex}>
                <td>
                  {rowIndex + 1}
                  <SpreadsheetRowResizer index={rowIndex} className={classes.rowResizer} />
                </td>
                {columns.map((column, columnIndex) => {
                  const cellValue = rowValue[columnIndex];
                  return (
                    <td key={columnIndex}>
                      <SpreadsheetCellValue rowIndex={rowIndex} style={{ marginLeft: level && columnIndex === 0 ? level * 15 : undefined }}>
                        {cellValue.value}
                      </SpreadsheetCellValue>
                    </td>
                  )
                })}
              </tr>
            )
          }}
        </SpreadsheetScrollableRows>
      </tbody>
    </Spreadsheet>
  );
};

export const defaultComponent = () => <SpreadsheetComponent />;

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);