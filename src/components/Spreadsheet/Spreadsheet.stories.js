import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  SpreadsheetScroller,
  Spreadsheet,
  SpreadsheetTableHeaderCell,
  SpreadsheetScrollableRows,
  SpreadsheetCellValue,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer
} from './';
import classes from './Spreadsheet-stories.module.sass';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}`, width: 200 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return rowColumns;
  });
};

const initialColumns = generateColumns(15);
const data = generateValues(initialColumns, 1000);

const initialRows = [];
for (let i = 100; i < 200; i++) {
  initialRows[i] = { level: 1 };
}

for (let i = 120; i < 170; i++) {
  initialRows[i] = { level: 2 };
}

//const initialScroll = { top: 5000, left: 0 };

const SpreadsheetComponent = () => {
  const { scroll, onScroll } = useSpreadsheet({ });
  const [columns, setColumns] = useState([{ size: 50 }, ...initialColumns]);
  const [rows, setRows] = useState([{ size: 30 }, ...initialRows]);
  return (
    <SpreadsheetScroller height={650} onScroll={onScroll}>
      <Spreadsheet
          scroll={scroll}
          columns={columns}
          onColumnsChange={setColumns}
          rows={rows}
          onRowsChange={setRows}
          data={data}
          className={classes.root}
          defaultColumnWidth={120}
          defaultRowHeight={16}
          rowVerticalPadding={4}
          rowBorderHeight={1}
          rowsPerPage={60}>
        <thead>
          <tr>
            <SpreadsheetTableHeaderCell columnIndex={0} rowIndex={0} />
            {columns.slice(1, columns.length).map((column, columnIndex) => {
              return (
                <SpreadsheetTableHeaderCell key={columnIndex} columnIndex={columnIndex + 1} rowIndex={0}>
                  {columnIndex + 1}
                  <SpreadsheetColumnResizer index={columnIndex + 1} className={classes.columnResizer} />
                </SpreadsheetTableHeaderCell>
              )
            })}
          </tr>
        </thead>

        <tbody>
          <SpreadsheetScrollableRows>
            {({ index: rowIndex, value: rowValue, row }) => {
              const level = row && row.level;
              return (
                <tr key={rowIndex}>
                  <td>
                    {rowIndex + 1}
                    <SpreadsheetRowResizer index={rowIndex + 1} className={classes.rowResizer} />
                  </td>
                  {columns.slice(1, columns.length).map((column, columnIndex) => {
                    const cellValue = rowValue[columnIndex];
                    return (
                      <td key={columnIndex + 1}>
                        <SpreadsheetCellValue rowIndex={rowIndex + 1} style={{ marginLeft: level && columnIndex === 0 ? level * 15 : undefined }}>
                          {cellValue.value}
                        </SpreadsheetCellValue>
                      </td>
                    )
                  })}
                </tr>
              )
            }}
          </SpreadsheetScrollableRows>
        </tbody>
      </Spreadsheet>
    </SpreadsheetScroller>
  );
};

export const defaultComponent = () => <SpreadsheetComponent />;

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);