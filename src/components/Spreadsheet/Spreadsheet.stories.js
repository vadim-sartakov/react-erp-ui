import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetTableHeaderCell,
  SpreadsheetScrollableRows,
  SpreadsheetColumnNumbersRow,
  SpreadsheetRowNumbersColumn,
  SpreadsheetCellValue
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
  return (
    <Spreadsheet
        columns={columns}
        rows={rows}
        data={data}
        className={classes.root}
        defaultColumnWidth={120}
        height={600}
        rowNumbersColumnWidth={50}
        defaultRowHeight={16}
        rowVerticalPadding={8}
        rowBorderHeight={1}
        rowsPerPage={40}>
      <thead>
        <SpreadsheetColumnNumbersRow>
          <SpreadsheetRowNumbersColumn Component="th" />
          {columns.map((column, columnIndex) => {
            return (
              <SpreadsheetTableHeaderCell key={columnIndex} index={columnIndex}>
                {columnIndex + 1}
              </SpreadsheetTableHeaderCell>
            )
          })}
        </SpreadsheetColumnNumbersRow>
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
                </td>
                {columns.map((column, columnIndex) => {
                  const cellValue = rowValue[columnIndex];
                  return (
                    <td key={columnIndex}>
                      <SpreadsheetCellValue index={columnIndex} style={{ marginLeft: level && columnIndex === 0 ? level * 15 : undefined }}>
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