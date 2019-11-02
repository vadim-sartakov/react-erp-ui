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
    // Prepended with special ones
    value,
    rows,
    columns,
    spreadsheetProps
  } = useSpreadsheet(props);

  const {
    visibleValues,
    scrollerProps
  } = useScroller({
    ...props,
    value,
    // TODO: extract 'size' property value from rows and columns
    rows,
    columns
  });

  const renderIntersectionColumn = visibleColumn => <SpreadsheetCell index={visibleColumn.index} className={classes.columnNumberCell} />;

  const renderColumnNumber = visibleColumn => {
    return (
      <SpreadsheetCell index={visibleColumn.index} className={classes.columnNumberCell}>
        {visibleColumn.index + 1}
        <SpreadsheetColumnResizer index={visibleColumn.index} className={classes.columnResizer} />
      </SpreadsheetCell>
    )
  };

  const renderRowNumber = (visibleRow, visibleColumn) => {
    return (
      <SpreadsheetCell index={visibleColumn.index} className={classes.columnNumberCell}>
        {visibleRow.index + 1}
        <SpreadsheetRowResizer index={visibleRow.index} className={classes.rowResizer} />
      </SpreadsheetCell>
    )
  };

  const renderCellValue = (visibleRow, visibleColumn) => {
    return (
      <SpreadsheetCell index={visibleColumn.index} className={classes.columnNumberCell}>
        {`Value ${visibleColumn.value.row} - ${visibleColumn.value.column}`}
      </SpreadsheetCell>
    )
  };

  return (
    <Scroller {...scrollerProps} height={600} width={800}>
      <Spreadsheet {...spreadsheetProps} className={classes.spreadsheet}>
        {visibleValues.map(visibleRow => {
          const row = rows[visibleRow.index];
          let columnsElements;
          switch(row.type) {
            case 'COLUMN_NUMBERS':
              columnsElements = visibleRow.value.map(visibleColumn => {
                const column = columns[visibleColumn.index];
                let columnElement;
                switch(column.type) {
                  case 'ROW_NUMBERS':
                    columnElement = renderIntersectionColumn(visibleColumn);
                    break;
                  default:
                    columnElement = renderColumnNumber(visibleColumn);
                }
                return columnElement;
              });
              break;
            case 'VALUES':
              columnsElements = visibleRow.value.map(visibleColumn => {
                const column = columns[visibleColumn.index];
                let element;
                switch(column.type) {
                  case 'ROW_NUMBER':
                    element = renderRowNumber(visibleRow, visibleColumn);
                    break;
                  default:
                    element = renderCellValue(visibleRow, visibleColumn);
                }
                return element;
              });
              break;
            default:
          }

          return (
            <SpreadsheetRow index={visibleRow.index}>
              {columnsElements}
            </SpreadsheetRow>
          );   
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
      columnNumbersRowHeight={40}
      rowNumberColumnWidth={50}
      defaultRowHeight={25}
      defaultColumnWidth={120}
      rowsPerPage={60}
      columnsPerPage={10} />
);

storiesOf('Spreadsheet', module)
  .add('default', defaultComponent);