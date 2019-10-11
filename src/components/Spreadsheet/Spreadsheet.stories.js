import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetTableHeaderCell,
  SpreadsheetScrollableHeaderColumns,
  SpreadsheetScrollableRows,
  SpreadsheetScrollableRowColumns,
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

for (let i = 50; i < 70; i++) {
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
          <SpreadsheetScrollableHeaderColumns>
             {({ index, value, depth, isGroup }) => (
                <SpreadsheetTableHeaderCell key={index} meta={value}>
                  {index + 1}
                </SpreadsheetTableHeaderCell>
             )}
          </SpreadsheetScrollableHeaderColumns>
        </SpreadsheetColumnNumbersRow>
      </thead>

      <tbody>
        <SpreadsheetScrollableRows>
          {({ index: rowIndex, value: rowValue, meta: rowMeta, isGroup, depth }) => {
            return (
              <tr key={rowIndex}>
                <td>
                  {rowIndex + 1}
                </td>
                <SpreadsheetScrollableRowColumns row={rowValue}>
                  {({ index: columnIndex, value: cellValue, meta: columnMeta }) => {
                    return (
                      <td key={columnIndex}>
                        <SpreadsheetCellValue meta={columnMeta} style={{ marginLeft: depth && columnIndex === 0 ? depth * 15 : undefined }}>
                          {cellValue.value}
                        </SpreadsheetCellValue>
                      </td>
                    )
                  }}
                </SpreadsheetScrollableRowColumns>
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