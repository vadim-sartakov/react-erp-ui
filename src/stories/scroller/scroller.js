import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from './Table';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}`, width: 200 }));
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
    const rows = { children: [] };
    const value = generateValues(columns, 1000);
    value[100].children = generateValues(columns, 200);
    rows.children[100] = { expanded: true };
    return (
      <Table
          rows={rows}
          columns={columns}
          value={value}
          rowsPerPage={20}
          defaultRowHeight={50} />
    )
  })
  .add('dynamic table with scrollable rows', () => {
    const columns = generateColumns(8);
    const rows = { totalCount: 1000 };

    const value = generateValues(columns, 1000);
    const loadPage = (page, itemsPerPage) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const pagedValue = value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
          resolve({ totalCount: 1000, value: pagedValue });
        }, 1000)
      });
    };
    return (
      <Table
          rows={rows}
          columns={columns}
          loadPage={loadPage}
          rowsPerPage={20}
          defaultRowHeight={50} />
    )
  });