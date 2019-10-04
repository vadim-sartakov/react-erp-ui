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
    return { columns: rowColumns };
  });
};

const columns = generateColumns(15);
const value = generateValues(columns, 1000);
value[100].children = generateValues(columns, 100);

const rows = [];
rows[100] = { expanded: true };

const SpreadsheetComponent = () => {
  return (
    <Spreadsheet
        columnsMeta={{ children: columns }}
        rowsMeta={{ children: rows }}
        value={value}
        className={classes.root}
        defaultColumnWidth={120}
        height={600}
        rowNumbersColumnWidth={50}
        defaultRowHeight={16}
        rowVerticalPadding={8}
        rowBorderHeight={1}>
      <thead>
        <SpreadsheetColumnNumbersRow>
          <SpreadsheetRowNumbersColumn Component="th" />
          <SpreadsheetScrollableHeaderColumns>
             {({ index, value, depth, isGroup }) => (
                <SpreadsheetTableHeaderCell key={index} meta={value}>
                  {/* TODO: This row index does not maintatn column number. It's visible value's index only */}
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
                  {/* TODO: This row index does not maintatn row number. It's visible value's index only */}
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