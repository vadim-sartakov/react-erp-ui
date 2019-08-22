import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
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

storiesOf('Table', module)
  .add('default', () => (
    <Table className="table">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeaderCell key={index} index={index}>
              {column.title}
              <TableColumnResizer index={index} className="resizer column-resizer" />
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {values.map((value, rowIndex) => (
          <TableRow key={rowIndex} index={rowIndex}>
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex}>
                {value[column.key]}
                <TableRowResizer index={rowIndex} className="resizer row-resizer" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ));