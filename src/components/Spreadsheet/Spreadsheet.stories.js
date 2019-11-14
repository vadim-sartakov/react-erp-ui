import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  Spreadsheet,
  SpreadsheetCell,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer,
  SpreadsheetMergedCell,
  renderBody
} from './';
import { useScroller, Scroller, loadPage } from '../Scroller';
import { generateGridValues } from '../Scroller/Scroller.stories';
import classes from './Spreadsheet-stories.module.sass';

export const value = generateGridValues(1000, 50);
value[0][0] = { ...value[0][0], colSpan: 2, rowSpan: 2 };
value[50][5] = { ...value[50][5], colSpan: 3, rowSpan: 3 };

export const loadRowsPageSync = value => (page, itemsPerPage) => {
  console.log('Loading sync page %s', page);
  return loadPage(value, page, itemsPerPage);
};

/*for (let i = 5; i < 100; i++) {
  rows[i] = { level: 1 };
}
for (let i = 20; i < 50; i++) {
  rows[i] = { level: 2 };
}*/

//const initialScroll = { top: 5000, left: 0 };

const renderFixedMergedCells = ({
  rows,
  columns,
  visibleRows,
  visibleColumns,
  visibleValues,
  fixRows,
  fixColumns,
  defaultRowHeight,
  defaultColumnWidth,
  renderCellValue
}) => {
  const mergedCells = visibleRows.slice(0, fixRows).reduce((acc, rowIndex) => {
    return visibleColumns.slice(0, fixColumns).reduce((acc, columnIndex) => {
      const rowValue = visibleValues[rowIndex - 1];
      const value = rowValue && rowValue[columnIndex - 1];
      if (value && (value.colSpan || value.rowSpan)) {
        const element = (
          <SpreadsheetMergedCell
              key={`${rowIndex}-${columnIndex}`}
              defaultRowHeight={defaultRowHeight}
              defaultColumnWidth={defaultColumnWidth}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              rows={rows}
              columns={columns}
              value={value}>
            {renderCellValue({ rowIndex, columnIndex, value, columns, rows })}
          </SpreadsheetMergedCell>
        );
        return [...acc, element];
      } else {
        return acc;
      }
    }, acc);
  }, []);
  console.log(mergedCells);
  return mergedCells;
};

/**
 * @param {import('../Scroller/useScroller').useScrollerProps | import('./useSpreadsheet').useSpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {

  const {
    spreadsheetProps,
    scrollerInputProps
  } = useSpreadsheet(props);

  const {
    scrollerProps,
    ...renderOptions
  } = useScroller({
    ...props,
    ...scrollerInputProps
  });

  const renderIntersectionColumn = ({ column, columnIndex }) => {
    return (
      <SpreadsheetCell key={columnIndex} column={column} className={classes.columnNumberCell} />
    );
  };

  const renderColumnNumber = ({ column, columnIndex }) => {
    return (
      <SpreadsheetCell
          key={columnIndex}
          column={column}
          className={classNames(
            classes.columnNumberCell,
            { [classes.lastFixedColumn]: columnIndex === props.fixColumns }
          )}>
        {columnIndex}
        <SpreadsheetColumnResizer index={columnIndex} column={column} className={classes.columnResizer} />
      </SpreadsheetCell>
    )
  };

  const renderRowNumber = ({ row, column, rowIndex, columnIndex }) => {
    return (
      <SpreadsheetCell
          key={columnIndex}
          column={column}
          className={classNames(
            classes.rowNumberCell,
            { [classes.lastFixedRow]: rowIndex === props.fixRows }
          )}>
        {rowIndex}
        <SpreadsheetRowResizer index={rowIndex} row={row} className={classes.rowResizer} />
      </SpreadsheetCell>
    )
  };

  const renderCellValue = ({ row, rowIndex, columnIndex, column, value, columns, rows }) => {
    return (
      <SpreadsheetCell
          key={columnIndex}
          defaultRowHeight={props.defaultRowHeight}
          defaultColumnWidth={props.defaultColumnWidth}
          row={row}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          column={column}
          columns={columns}
          rows={rows}
          value={value}
          className={classNames(
            classes.cell,
            {
              [classes.lastFixedRow]: rowIndex === props.fixRows,
              [classes.lastFixedColumn]: columnIndex === props.fixColumns
            }
          )}>
        {value ? `Value ${value.row} - ${value.column}` : ''}
      </SpreadsheetCell>
    )
  };

  return (
    <Scroller {...scrollerProps} height={props.height} width={props.width}>
      <Spreadsheet {...spreadsheetProps} className={classes.spreadsheet}>
        {renderBody({
          ...renderOptions,
          rowProps: { className: classes.row },
          renderIntersectionColumn,
          renderColumnNumber,
          renderRowNumber,
          renderCellValue
        })}
        {renderFixedMergedCells({
          ...props,
          ...renderOptions,
          renderCellValue
        })}
      </Spreadsheet>
    </Scroller>
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
      loadRowsPage={loadRowsPageSync(value)}
      width={800}
      height={600}
      fixRows={2}
      fixColumns={2}
      {...props} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);