import React, { useContext } from 'react';
import ScrollerCell from '../Scroller/ScrollerCell';
import SpreadsheetContext from './SpreadsheetContext';
import { getMergedCellSize } from './utils';

/**
 * @param {import('./').SpreadsheetCellProps} props 
 */
const SpreadsheetCell = ({
  rowIndex,
  columnIndex,
  column,
  row,
  rows,
  columns,
  value,
  ...props
}) => {
  const { fixRows, fixColumns, defaultRowHeight, defaultColumnWidth } = useContext(SpreadsheetContext);

  const fixedRow = rowIndex <= fixRows;
  const fixedColumn = columnIndex <= fixColumns;

  const width = value && value.colSpan && getMergedCellSize({
    // Preventing from merging more than fixed range
    count: fixedColumn ? fixColumns - (columnIndex - 1) : value.colSpan,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = value && value.rowSpan && getMergedCellSize({
    count: fixedRow ? fixRows - (rowIndex - 1) : value.rowSpan,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });

  const nextStyle = { width, height };
  if (value && value.colSpan) nextStyle.gridColumn = `span ${value.colSpan}`;
  if (value && value.rowSpan) nextStyle.gridRow = `span ${value.rowSpan}`;

  return <ScrollerCell row={row} column={column} {...props} style={nextStyle} />;
};

export default SpreadsheetCell;