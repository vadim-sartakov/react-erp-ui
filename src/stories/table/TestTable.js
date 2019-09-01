import React from 'react';
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
import './TestTable.sass';

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

export default TestTable;