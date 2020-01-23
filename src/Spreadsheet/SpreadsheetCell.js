import React, { useContext } from 'react';
import { ScrollerCell } from '../Scroller';
import { SpreadsheetContext } from './';
import { getCellsRangeSize, getMergedCellPosition } from './utils';

const SpreadsheetCell = ({
  mergedRange,
  rows,
  columns,
  overscrolled,
  style,
  children,
  ...props
}) => {

  const {
    defaultRowHeight,
    defaultColumnWidth,
    fixRows,
    fixColumns,
    scrollerTop,
    scrollerLeft
  } = useContext(SpreadsheetContext);

  let elements = [];

  if (!overscrolled) {
    elements.push((
      <ScrollerCell key="0" {...props} style={style}>
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

    const width = getCellsRangeSize({
      count: (mergedRange.end.column - mergedRange.start.column) + 1,
      meta: columns,
      startIndex: columnIndex,
      defaultSize: defaultColumnWidth
    });
    const height = getCellsRangeSize({
      count: (mergedRange.end.row - mergedRange.start.row) + 1,
      meta: rows,
      startIndex: rowIndex,
      defaultSize: defaultRowHeight
    });

    const fixWidth = fixColumns && columnIndex <= fixColumns && getCellsRangeSize({
      count: fixColumns - mergedRange.start.column,
      meta: columns,
      startIndex: columnIndex,
      defaultSize: defaultColumnWidth
    });

    const fixHeight = fixRows && rowIndex <= fixRows && getCellsRangeSize({
      count: fixRows - mergedRange.start.row,
      meta: rows,
      startIndex: rowIndex,
      defaultSize: defaultRowHeight
    });

    const baseRootStyle = {
      position: 'absolute',
      top: top - scrollerTop,
      left: left - scrollerLeft,
      pointerEvents: 'none'
    };

    const baseWrapperStyle = {
      position: 'sticky',
      overflow: 'hidden',
      top,
      left,
      pointerEvents: 'auto'
    };

    const valueStyle = {
      width,
      height,
      top: 'auto',
      left: 'auto',
      ...style
    };

    if (isFixedRowArea && isFixedColumnArea) {
      const rootStyle = {
        ...baseRootStyle,
        width: `calc(100% + ${scrollerLeft - left}px)`,
        height: `calc(100% + ${scrollerTop - top}px)`,
        zIndex: 7
      };
      const wrapperStyle = {
        ...baseWrapperStyle,
        width: Math.min(fixWidth, width),
        height: Math.min(fixHeight, height)
      };
      elements.push(
        <div key="7" style={rootStyle}>
          <div style={wrapperStyle}>
            <ScrollerCell {...props} style={valueStyle}>
              {children}
            </ScrollerCell>
          </div>
        </div>
      );
    }
    if (isFixedColumnArea) {
      const rootStyle = {
        ...baseRootStyle,
        width: `calc(100% + ${scrollerLeft - left}px)`,
        height,
        zIndex: 3
      };
      const wrapperStyle = {
        ...baseWrapperStyle,
        width: Math.min(fixWidth, width),
        height
      };
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
    if (isFixedRowArea) {
      const rootStyle = {
        ...baseRootStyle,
        width,
        height: `calc(100% + ${scrollerTop - top}px)`,
        zIndex: 5
      };
      const wrapperStyle = {
        ...baseWrapperStyle,
        width,
        height: Math.min(fixHeight, height)
      };
      elements.push(
        <div key="5" style={rootStyle}>
          <div style={wrapperStyle}>
            <ScrollerCell {...props} style={valueStyle}>
              {children}
            </ScrollerCell>
          </div>
        </div>
      );
    }

    // Not fixed area
    elements.push((
      <ScrollerCell
          key="1"
          {...props}
          style={{
            position: 'absolute',
            top: top - scrollerTop,
            left: left - scrollerLeft,
            width,
            height,
            zIndex: 1,
            ...style
          }}>
        {children}
      </ScrollerCell>
    ));
    
  }

  return elements;

};

export default SpreadsheetCell;