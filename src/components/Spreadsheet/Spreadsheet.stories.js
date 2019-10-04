import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetTableHeaderCell,
  SpreadsheetScrollableHeaderColumns,
  SpreadsheetScrollableRows,
  SpreadsheetScrollableRowColumns,
  SpreadsheetColumnNumbersRow,
  SpreadsheetRowNumbersColumn
} from './';
import classes from './Spreadsheet.stories.module.sass';

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

const SpreadsheetComponent = () => {
  return (
    <Spreadsheet
        value={value}
        className={classes.root}
        height={500}>
      <thead>
        <SpreadsheetColumnNumbersRow>
          <SpreadsheetRowNumbersColumn />
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
                <SpreadsheetRowNumbersColumn>
                  {/* TODO: This row index does not maintatn row number. It's visible value's index only */}
                  {rowIndex + 1}
                </SpreadsheetRowNumbersColumn>
                <SpreadsheetScrollableRowColumns row={rowValue}>
                  {({ index: columnIndex, value: cellValue, meta: columnMeta }) => {
                    return (
                      <td key={columnIndex}>
                        {cellValue}
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