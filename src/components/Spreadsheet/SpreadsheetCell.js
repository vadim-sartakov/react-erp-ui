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

  let elements = [];

  if (!overscrolled) {
    elements.push((
      <ScrollerCell key="0" {...props}>
        {children}
      </ScrollerCell>
    ));
  }

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

    if (overscrolled) {
      elements.push((
        <ScrollerCell
            key="0"
            {...props}
            style={{
              position: 'absolute',
              top,
              left
            }}>
          {children}
        </ScrollerCell>
      ));
    }

    /*if (isFixedRowArea && isFixedColumnArea) {
      element = (
        <ScrollerCell {...props}>
          {children}
        </ScrollerCell>
      );
    }*/
    if (isFixedColumnArea) {
      const rootStyle = {
        position: 'absolute',
        top,
        left,
        width: '100%',
        height,
        zIndex: 3,
        pointerEvents: 'none'
      };
      const wrapperStyle = {
        position: 'sticky',
        width: fixWidth,
        height,
        overflow: 'hidden',
        left,
        pointerEvents: 'auto'
      };
      const valueStyle = {
        width,
        height
      }
      elements.push(
        <div key="3" style={rootStyle}>
          <div style={wrapperStyle}>
            <ScrollerCell {...props} style={valueStyle}>
              {children}
            </ScrollerCell>
          </div>
        </div>
      );
    }
    /*if (isFixedRowArea) {
      const style = {
        position: 'absolute',
        width,
        height: fixHeight
      };
      element = (
        <ScrollerCell {...props}>
          {children}
          <ScrollerCell {...props} style={style}>
            {children}
          </ScrollerCell>
        </ScrollerCell>
      );
    }*/

    // Not fixed area
    elements.push((
      <ScrollerCell
          key="1"
          {...props}
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            zIndex: 1
          }}>
        {children}
      </ScrollerCell>
    ));
    
  }

  return elements;

};

export default SpreadsheetCell;