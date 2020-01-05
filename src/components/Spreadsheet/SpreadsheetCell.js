import React, { useContext } from 'react';
import ScrollerCell from '../Scroller/ScrollerCell';
import SpreadsheetContext from './SpreadsheetContext';
import { getMergedCellSize, getMergedCellPosition } from './utils';

/**
 * @param {import('./').SpreadsheetCellProps} props 
 */
const SpreadsheetCell = ({
  mergedRange,
  rows,
  columns,
  rowIndex,
  columnIndex,
  overscrolled,
  children,
  ...props
}) => {

  const {
    defaultRowHeight,
    defaultColumnWidth,
    fixRows,
    fixColumns
  } = useContext(SpreadsheetContext);

  let element;

  if (mergedRange) {

    const columnIndex = mergedRange.start.column;
    const rowIndex = mergedRange.start.row;

    const isFixedColumnArea = columnIndex <= fixColumns;
    const isFixedRowArea = rowIndex <= fixRows;
    
    const top = getMergedCellPosition({
      meta: rows,
      index: rowIndex,
      defaultSize: defaultRowHeight
    });
    const left = getMergedCellPosition({
      meta: columns,
      index: columnIndex,
      defaultSize: defaultColumnWidth
    });

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
    });

    /*if (isFixedRowArea && isFixedColumnArea) {
      element = (
        <ScrollerCell {...props}>
          {children}
        </ScrollerCell>
      );
    }
    if (isFixedColumnArea) {
      element = (
        <ScrollerCell {...props}>
          {children}
        </ScrollerCell>
      );
    }
    if (isFixedRowArea) {
      element = (
        <ScrollerCell {...props}>
          {children}
        </ScrollerCell>
      );
    }*/
    // Value level
    const style = {
      position: 'absolute',
      top,
      left,
      width,
      height,
      zIndex: 1
    };
    element = (
      <>
        {!overscrolled && (
          <ScrollerCell {...props}>
            {children}
          </ScrollerCell>
        )}
        <ScrollerCell {...props} style={style}>
          {children}
        </ScrollerCell>
      </>
    );
  } else {
    element = (
      <ScrollerCell {...props}>
        {children}
      </ScrollerCell>
    );
  }

  return element;

};

export default SpreadsheetCell;