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

const columns = [
  {
    title: 'Column 1',
    key: 'fieldOne'
  },
  {
    title: 'Column 2',
    key: 'fieldTwo'
  },
  {
    title: 'Column 3',
    key: 'fieldThree'
  },
  {
    title: 'Column 4',
    key: 'fieldFour'
  }
];

const values = new Array(20).fill(1).map((item, index) => {
  return {
    fieldOne: 'Field one: ' + index,
    fieldTwo: 'Field two: ' + index,
    fieldThree: 'Field three: ' + index,
    fieldFour: 'Field four: ' + index,
  };
});

const TestTable = props => (
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

storiesOf('Table', module)
  .add('default', () => <TestTable />);