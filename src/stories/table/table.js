import React from 'react';
import { storiesOf } from '@storybook/react';
import TestTable from './TestTable';

const createColumns = count => new Array(count).fill(1).map((item, index) => {
  return {
    title: `Column ${index}`,
    key: `field${index}`
  };
});

const createValues = (columns, count) => new Array(count).fill(1).map((item, valueIndex) => {
  return columns.reduce((acc, column, columnIndex) => {
    return {
      ...acc,
      [column.key]: `Value ${valueIndex} - ${columnIndex}`
    };
  }, {});
});

const columns = createColumns(6);
const rows = createValues(columns, 20);

storiesOf('Table', module)
  .add('default', () => <TestTable columns={columns} rows={rows} />)
  .add('fixed columns', () => <TestTable columns={columns} rows={rows} fixRows={1} fixColumns={2} />);