import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellValue,
  TableColumnResizer,
  TableRowResizer
} from '../../components/Table';
import './table.sass';

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

const TestTable = ({ columnsCount, valuesCount, ...props }) => {
  const columns = createColumns(columnsCount);
  const values = createValues(columns, valuesCount);
  return (
    <Table
        className="table"
        defaultRowHeight={16}
        defaultColumnWidth={300}
        {...props}>
      <TableHeader>
        <TableRow index={0}>
          {columns.map((column, index) => (
            <TableHeaderCell key={index} index={index}>
              <TableCellValue>
                {column.title}
              </TableCellValue>
              <TableColumnResizer index={index} className="resizer column-resizer" />
              <TableRowResizer className="resizer row-resizer" />
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {values.map((value, rowIndex) => (
          <TableRow key={rowIndex} index={rowIndex + 1}>
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex}>
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

storiesOf('Table', module)
  .add('default', () => <TestTable columnsCount={6} valuesCount={20} />)
  .add('fixed rows', () => <TestTable columnsCount={6} valuesCount={20} fixRows={2} />);