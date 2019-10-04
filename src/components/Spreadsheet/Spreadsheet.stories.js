import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetHeaderColumnsRow,
  SpreadsheetTableHeaderCell,
  SpreadsheetScrollableHeaderColumns,
  SpreadsheetScrollableRows,
  SpreadsheetScrollableRowColumns
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
        <SpreadsheetHeaderColumnsRow>
          <SpreadsheetScrollableHeaderColumns>
             {({ index, value, depth, isGroup }) => (
                <SpreadsheetTableHeaderCell key={index} meta={value}>
                  {index + 1}
                </SpreadsheetTableHeaderCell>
             )}
          </SpreadsheetScrollableHeaderColumns>
        </SpreadsheetHeaderColumnsRow>
      </thead>

      <tbody>
        <SpreadsheetScrollableRows>
          {({ index: rowIndex, value: rowValue, meta: rowMeta, isGroup, depth }) => {
            return (
              <tr key={rowIndex}>
                <SpreadsheetScrollableRowColumns row={rowValue}>
                  {({ index: columnIndex, value: cellValue, meta: columnMeta }) => {
                    return (
                      <td key={columnIndex}>

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