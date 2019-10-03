import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Spreadsheet,
  SpreadsheetHeader
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
    <Spreadsheet value={value}>
      <SpreadsheetHeader>
        {({ index, value, meta, depth, isGroup }) => (
          
        )}
      </SpreadsheetHeader>
    </Spreadsheet>
  );
};

export const defaultComponent = () => <SpreadsheetComponent />;

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);