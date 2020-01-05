import React, { useContext } from 'react';
import ScrollerCell from '../Scroller/ScrollerCell';
import SpreadsheetContext from './SpreadsheetContext';
import { getMergedCellSize } from './utils';

/**
 * @param {import('./').SpreadsheetCellProps} props 
 */
const SpreadsheetCell = ({
  mergedRange,
  rows,
  columns,
  rowIndex,
  columnIndex,
  children,
  ...props
}) => {

  /*const {
    defaultRowHeight,
    defaultColumnWidth,
    fixRows,
    fixColumns,
    specialRowsCount,
    specialColumnsCount
  } = useContext(SpreadsheetContext);

  const width = getMergedCellSize({
    count: mergedRange.end.column - mergedRange.start.column,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = getMergedCellSize({
    count: mergedRange.end.row - mergedRange.start.row,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });

  const fixWidth = fixColumns && columnIndex <= fixColumns && getMergedCellSize({
    count: fixColumns - mergedRange.start.column,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });

  const fixHeight = fixRows && rowIndex <= fixRows && getMergedCellSize({
    count: fixRows - mergedRange.start.row,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });*/

  return (
    <ScrollerCell {...props}>
      {children}
    </ScrollerCell>
  );
};

export default SpreadsheetCell;