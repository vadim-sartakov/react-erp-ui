import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCellValue,
  TableColumnResizer,
  TableRowResizer,
  TableBody,
  TableCell
} from './';
import './Table.stories.sass';

const TestTable = ({ columns, rows, ...props }) => {
  return (
    <Table
        className="table"
        defaultRowHeight={16}
        defaultColumnWidth={300}
        classes={{
          fixColumn: 'fix-column',
          lastFixColumn: 'last-fix-column',
          fixRow: 'fix-row'
        }}
        {...props}>
      <TableHeader>
        <TableRow index={0}>
          {columns.map((column, columnIndex) => (
            <TableHeaderCell key={columnIndex} columnIndex={columnIndex}>
              <TableCellValue>
                {column.title}
              </TableCellValue>
              <TableColumnResizer index={columnIndex} className="resizer column-resizer" />
              <TableRowResizer className="resizer row-resizer" />
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {rows.map((value, rowIndex) => (
          <TableRow key={rowIndex} index={rowIndex + 1}>
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex} columnIndex={columnIndex}>
                <TableCellValue>
                  {value[column.key]}
                </TableCellValue>
                <TableRowResizer className="resizer row-resizer" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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