import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from './Table';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}` }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return { columns: rowColumns };
  });
};

storiesOf('Scroller', module)
  .add('static table with scrollable rows', () => {
    console.log(generateValues(generateColumns(8), 50));
    return(<div />);
    /*return (
      <Table
          value={generateValues(generateColumns(8), 50)}
          rowsPerPage={20}
          defaultRowHeight={20} />
    )*/
  });