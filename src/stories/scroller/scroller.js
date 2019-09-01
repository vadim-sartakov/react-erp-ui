import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from './Table';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}`, width: 100 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return { columns: rowColumns };
  });
};

storiesOf('Scroller', module)
  .add('static table with scrollable rows', () => {
    const columns = generateColumns(8);
    return (
      <Table
          columns={columns}
          value={generateValues(columns, 1000)}
          rowsPerPage={20}
          defaultRowHeight={50} />
    )
  });