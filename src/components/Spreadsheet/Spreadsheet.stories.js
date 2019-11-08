import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  useSpreadsheet,
  Spreadsheet,
  SpreadsheetRow,
  SpreadsheetCell,
  SpreadsheetColumnResizer,
  SpreadsheetRowResizer
} from './';
import { useScroller, Scroller, loadPage } from '../Scroller';
import { generateCustomMeta, generateGridValues } from '../Scroller/Scroller.stories';
import classes from './Spreadsheet-stories.module.sass';

export const value = generateGridValues(1000, 50);
//const rows = generateCustomMeta(value.length, 60);
const columns = generateCustomMeta(value[0].length, 180);

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

/**
 * @param {import('../Scroller/useScroller').useScrollerProps | import('./useSpreadsheet').useSpreadsheetProps} props 
 */
const SpreadsheetComponent = props => {

  const {
    rows,
    columns,
    spreadsheetProps,
    scrollerInputProps
  } = useSpreadsheet(props);

  const {
    visibleRows,
    visibleColumns,
    visibleValues,
    scrollerProps
  } = useScroller({
    ...props,
    ...scrollerInputProps
  });

  const renderIntersectionColumn = visibleColumn => <SpreadsheetCell key={visibleColumn} index={visibleColumn} className={classes.columnNumberCell} />;

  const renderColumnNumber = visibleColumn => {
    return (
      <SpreadsheetCell key={visibleColumn} index={visibleColumn} className={classes.columnNumberCell}>
        {visibleColumn}
        <SpreadsheetColumnResizer index={visibleColumn} className={classes.columnResizer} />
      </SpreadsheetCell>
    )
  };

  const renderRowNumber = (visibleRow, visibleColumn) => {
    return (
      <SpreadsheetCell key={visibleColumn} index={visibleColumn} className={classes.rowNumberCell}>
        {visibleRow}
        <SpreadsheetRowResizer index={visibleRow} className={classes.rowResizer} />
      </SpreadsheetCell>
    )
  };

  const renderCellValue = (row, column, value) => {
    return (
      <SpreadsheetCell key={column} index={column} className={classes.cell}>
        {value ? `Value ${value.row} - ${value.column}` : ''}
      </SpreadsheetCell>
    )
  };

  return (
    <Scroller {...scrollerProps} height={props.height} width={props.width}>
      <Spreadsheet {...spreadsheetProps} className={classes.spreadsheet}>
        {visibleRows.map(visibleRow => {
          const row = rows[visibleRow];
          let columnsElements;
          const rowType = (row && row.type) || 'VALUES';
          switch(rowType) {
            case 'COLUMN_NUMBERS':
              columnsElements = visibleColumns.map(visibleColumn => {
                const column = columns[visibleColumn];
                let columnElement;
                const columnsType = (column && column.type) || 'VALUES';
                switch(columnsType) {
                  case 'ROW_NUMBERS':
                    columnElement = renderIntersectionColumn(visibleColumn);
                    break;
                  default:
                    columnElement = renderColumnNumber(visibleColumn);
                    break;
                }
                return columnElement;
              });
              break;
            case 'VALUES':
              columnsElements = visibleColumns.map(visibleColumn => {
                const column = columns[visibleColumn];
                const rowValue = visibleValues[visibleRow - 1];
                const value = rowValue && rowValue[visibleColumn - 1];
                let element;
                const columnsType = (column && column.type) || 'VALUES';
                switch(columnsType) {
                  case 'ROW_NUMBER':
                    element = renderRowNumber(visibleRow, visibleColumn);
                    break;
                  default:
                    element = renderCellValue(visibleRow, visibleColumn, value);
                    break;
                }
                return element;
              });
              break;
            default:
          }

          return (
            <SpreadsheetRow key={visibleRow} index={visibleRow} className={classes.row}>
              {columnsElements}
            </SpreadsheetRow>
          );   
        })}
      </Spreadsheet>
    </Scroller>
  );
};

export const defaultComponent = props => (
  <SpreadsheetComponent
      value={value}
      columnNumbersRowHeight={20}
      rowNumberColumnWidth={40}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={15}
      totalColumns={columns.length}
      totalRows={value.length}
      loadRowsPage={loadRowsPageSync(value)}
      width={800}
      height={600}
      {...props} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);