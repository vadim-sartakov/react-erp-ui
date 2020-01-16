import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Spreadsheet, { SpreadsheetResizer, SpreadsheetCell, renderColumnGroup, renderRowGroup } from './';
import { generateGridValues } from '../test-utils/generateValues';
import classes from './Spreadsheet-stories.module.sass';

const renderRowGroupButton = ({ row, column, rowIndex, columnIndex }) => {
  return (
    <SpreadsheetCell row={row} column={column} className={classes.groupButtonContainer} style={{ zIndex: 8 }}>
      <div className={classes.groupButton}>
        {columnIndex + 1}
      </div>
    </SpreadsheetCell>
  )
};

const renderColumnGroupButton = ({ row, column, rowIndex, columnIndex }) => {
  return (
    <SpreadsheetCell row={row} column={column} className={classes.groupButtonContainer} style={{ zIndex: 8 }}>
      <div className={classes.groupButton}>
        {rowIndex + 1}
      </div>
    </SpreadsheetCell>
  )
};

const renderRowGroupCustom = props => renderRowGroup({ ...props, backgroundColor: '#f1f1f1' });
const renderColumnGroupCustom = props => renderColumnGroup({ ...props, backgroundColor: '#f1f1f1' });

const renderGroupEmptyArea = ({ row, column }) => {
  return (
    <SpreadsheetCell row={row} column={column} className={classes.groupEmptyArea}/>
  )
};

const renderColumnsFixedArea = ({ style }) => {
  return <div className={classes.lastFixedColumn} style={style} />;
};

const renderRowsFixedArea = ({ style }) => {
  return <div className={classes.lastFixedRow} style={style} />;
};

const renderRowColumnNumbersIntersection = ({ row, column, columnIndex }) => (
  <SpreadsheetCell row={row} column={column} className={classes.columnNumberCell} />
);

const renderColumnNumber = ({ row, column, columnIndex, key }) => (
  <SpreadsheetCell
      row={row}
      column={column}
      className={classes.columnNumberCell}>
    {key + 1}
    <SpreadsheetResizer mode="column" column={column} index={columnIndex} className={classes.columnResizer} />
  </SpreadsheetCell>
);

const renderRowNumber = ({ row, column, rowIndex, key }) => (
  <SpreadsheetCell
      row={row}
      column={column}
      className={classes.rowNumberCell}>
    {key + 1}
    <SpreadsheetResizer mode="row" row={row} index={rowIndex} className={classes.rowResizer} />
  </SpreadsheetCell>
);

const renderCellValue = ({ row, column, rows, columns, value, mergedRange, overscrolled }) => (
  <SpreadsheetCell
      row={row}
      column={column}
      rows={rows}
      columns={columns}
      mergedRange={mergedRange}
      overscrolled={overscrolled}
      className={classes.cell}>
    {value ? `Value ${value.row} - ${value.column}` : ''}
  </SpreadsheetCell>
);

/**
 * @param {import('./').SpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {

  const [rows, onRowsChange] = useState(props.rows);
  const [columns, onColumnsChange] = useState(props.columns);

  return (
    <Spreadsheet
        {...props}
        rows={rows}
        onRowsChange={onRowsChange}
        columns={columns}
        onColumnsChange={onColumnsChange}
        className={classes.spreadsheet}
        renderGroupEmptyArea={renderGroupEmptyArea}
        renderColumnGroupButton={renderColumnGroupButton}
        renderRowGroupButton={renderRowGroupButton}
        renderRowGroup={renderRowGroupCustom}
        renderColumnGroup={renderColumnGroupCustom}
        renderColumnsFixedArea={renderColumnsFixedArea}
        renderRowsFixedArea={renderRowsFixedArea}
        renderRowColumnNumbersIntersection={renderRowColumnNumbersIntersection}
        renderColumnNumber={renderColumnNumber}
        renderRowNumber={renderRowNumber}
        renderCellValue={renderCellValue} />
  );
};

export const defaultComponent = props => (
  <SpreadsheetComponent
      columnNumbersRowHeight={20}
      rowNumberColumnWidth={40}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={15}
      totalColumns={50}
      totalRows={1000}
      value={generateGridValues(1000, 50)}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

export const withMergedCells = props => {
  /** @type {import('./').CellsRange[]} */
  const mergedCells = [
    // Overlapping with all fixed areas
    {
      start: { row: 0, column: 0 },
      end: { row: 3, column: 3 }
    },
    // Overlapping with fixed rows area
    {
      start: { row: 0, column: 8 },
      end: { row: 5, column: 9 }
    },
    // Overlapping with fixed columns area
    {
      start: { row: 10, column: 0 },
      end: { row: 11, column: 30 }
    },
    // Not fixed area
    {
      start: { row: 20, column: 5 },
      end: { row: 25, column: 7 }
    },
    // Overscrolled not fixed area
    {
      start: { row: 30, column: 5 },
      end: { row: 150, column: 7 }
    },

    // Overscrolled fixed columns area
    {
      start: { row: 14, column: 0 },
      end: { row: 150, column: 0 }
    },
    // Overscrolled fixed rows area
    {
      start: { row: 0, column: 12 },
      end: { row: 1, column: 30 }
    }
  ];
  return (
    <SpreadsheetComponent
        columnNumbersRowHeight={20}
        rowNumberColumnWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        mergedCells={mergedCells}
        value={generateGridValues(1000, 50)}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        {...props} />
  )
};

export const withGroups = props => {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows[i] = { level: 1 };
  }

  for (let i = 5; i < 10; i++) {
    rows[i] = { level: 2 };
  }
  for (let i = 15; i < 20; i++) {
    rows[i] = { level: 2 };
  }

  for (let i = 5; i < 10; i++) {
    rows[i] = { ...rows[i], hidden: true };
  }

  for (let i = 15; i < 20; i++) {
    rows[i] = { ...rows[i], hidden: true };
  }

  for (let i = 30; i < 50; i++) {
    rows[i] = { level: 1 };
  }

  for (let i = 35; i < 40; i++) {
    rows[i] = { level: 2 };
  }
  for (let i = 45; i < 50; i++) {
    rows[i] = { level: 2 };
  }

  for (let i = 35; i < 40; i++) {
    rows[i] = { ...rows[i], hidden: true };
  }

  for (let i = 45; i < 50; i++) {
    rows[i] = { ...rows[i], hidden: true };
  }

  const columns = [];
  for (let i = 0; i < 20; i++) {
    columns[i] = { level: 1 };
  }
  for (let i = 5; i < 10; i++) {
    columns[i] = { level: 2 };
  }

  return (
    <SpreadsheetComponent
        columnNumbersRowHeight={20}
        rowNumberColumnWidth={40}
        defaultRowHeight={25}
        defaultColumnWidth={120}
        rowsPerPage={60}
        columnsPerPage={15}
        totalColumns={50}
        totalRows={1000}
        value={generateGridValues(1000, 50)}
        width={800}
        height={600}
        fixRows={2}
        fixColumns={2}
        rows={rows}
        columns={columns}
        groupSize={20}
        {...props} />
  )
};

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent)
  .add('merged cells', withMergedCells)
  .add('groups', withGroups);