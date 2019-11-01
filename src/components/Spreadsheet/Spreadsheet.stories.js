import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  Spreadsheet,
  SpreadsheetRow,
  SpreadsheetCell,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer
} from './';
import { useScroller, Scroller } from '../Scroller';
import classes from './Spreadsheet-stories.module.sass';

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ width: 200 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return rowColumns;
  });
};

const columns = generateColumns(15);
const value = generateValues(columns, 1000);

const rows = [];
for (let i = 5; i < 100; i++) {
  rows[i] = { level: 1 };
}
for (let i = 20; i < 50; i++) {
  rows[i] = { level: 2 };
}

//const initialScroll = { top: 5000, left: 0 };

/**
 * @param {import('../Scroller/useScroller').useScrollerProps | import('./useSpreadsheet').useSpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {
  const {
    groupRows,
    groupColumns,
    columnNumbersRow,
    rowNumbersColumn,
    fixedValue,
    value,
    rows,
    columns,
    spreadsheetProps
  } = useSpreadsheet(props);

  const {
    visibleValues,
    rowsStartIndex,
    columnsStartIndex,
    scrollerProps
  } = useScroller({
    ...props,
    value,
    // TODO: extract 'size' property value from rows and columns
    rows,
    columns
  });

  const renderColumnNumber = index => {
    return (
      <SpreadsheetCell key={index} columns={1} fixed className={classes.columnNumberCell}>
        {index + 1}
        <SpreadsheetColumnResizer index={index} className={classes.columnResizer} />
      </SpreadsheetCell>
    )
  };

  const renderRowNumber = index => {
    return (
      <SpreadsheetCell column={rowNumbersColumn} fixed className={classes.rowNumberCell}>
        {index + 1}
        <SpreadsheetRowResizer index={index} className={classes.rowResizer} />
      </SpreadsheetCell>
    );
  };
  const renderCellValue = ({ cellValue, row, index, fixed }) => {
    return (
      <SpreadsheetCell
          index={index}
          className={classNames(classes.cell)}
          fixed={fixed}
          style={{ paddingLeft: row.level && index === 0 ? row.level * 15 : undefined }}>
        {cellValue.value}
      </SpreadsheetCell>
    );
  };

  return (
    <Scroller {...scrollerProps} height={600}>
      <Spreadsheet
          {...spreadsheetProps}
          className={classes.spreadsheet}
          classes={{
            fixed: classes.fixed,
            lastFixedRowCell: classes.lastFixedRowCell,
            lastFixedColumnCell: classes.lastFixedColumnCell
          }}>

        {/* Column numbers row */}
        <SpreadsheetRow row={columnNumbersRow} fixed>
          {/* Row numbers intersection */}
          <SpreadsheetCell column={rowNumbersColumn} fixed />
          {[...Array(props.totalColumns).keys()].map(columnIndex => {
            return renderColumnNumber(columnIndex);
          })}
        </SpreadsheetRow>

        {/* Fixed rows */}
        {fixedValue.map((fixedRow, fixedRowIndex) => {
          return (
            <SpreadsheetRow key={fixedRowIndex} index={fixedRowIndex}>
              {renderRowNumber(fixedRowIndex)}
              {fixedRow.map((fixedColumn, fixedColumnIndex) => {
                return renderCellValue({ cellValue: fixedColumn, index: fixedColumnIndex, fixed: true });
              })}
            </SpreadsheetRow>
          )
        })}

        {/* Value rows */}
        {visibleValues.map((visibleRow, visibleRowIndex) => {
          const rowIndex = rowsStartIndex + visibleRowIndex;
          return (
            <SpreadsheetRow key={rowIndex} index={rowIndex}>
              {renderRowNumber(rowIndex)}
              {visibleRow.map((visibleColumn, visibleColumnIndex) => {
                const columnIndex = columnsStartIndex + visibleColumnIndex;
                return renderCellValue({ cellValue: visibleColumn, index: columnIndex });
              })}
            </SpreadsheetRow>
          )
        })}
      </Spreadsheet>
    </Scroller>
  );
};

export const defaultComponent = () => (
  <SpreadsheetComponent
      value={value}
      rows={rows}
      columns={columns}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={10} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);