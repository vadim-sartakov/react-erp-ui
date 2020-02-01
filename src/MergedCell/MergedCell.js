import React from 'react';
import { getCellPosition, getCellsRangeSize } from '../utils/gridUtils';

const MergedCell = ({
  style,
  defaultRowHeight,
  defaultColumnWidth,
  mergedRange,
  rows,
  columns,
  fixRows,
  fixColumns,
  scrollerTop,
  scrollerLeft,
  children
}) => { 
  const elements = [];

  const rowStartIndex = Math.min(mergedRange.start.row, mergedRange.end.row);
  const columnStartIndex = Math.min(mergedRange.start.column, mergedRange.end.column);

  const rowEndIndex = Math.max(mergedRange.start.row, mergedRange.end.row);
  const columnEndIndex = Math.max(mergedRange.start.column, mergedRange.end.column);

  const isFixedColumnArea = columnStartIndex <= fixColumns;
  const isFixedRowArea = rowStartIndex <= fixRows;
  
  const top = getCellPosition({
    meta: rows,
    index: rowStartIndex,
    defaultSize: defaultRowHeight
  });
  const left = getCellPosition({
    meta: columns,
    index: columnStartIndex,
    defaultSize: defaultColumnWidth
  });

  const width = getCellsRangeSize({
    count: (columnEndIndex - columnStartIndex) + 1,
    meta: columns,
    startIndex: columnStartIndex,
    defaultSize: defaultColumnWidth
  });
  const height = getCellsRangeSize({
    count: (rowEndIndex - rowStartIndex) + 1,
    meta: rows,
    startIndex: rowStartIndex,
    defaultSize: defaultRowHeight
  });

  const fixWidth = fixColumns && columnStartIndex <= fixColumns && getCellsRangeSize({
    count: fixColumns - columnStartIndex,
    meta: columns,
    startIndex: columnStartIndex,
    defaultSize: defaultColumnWidth
  });

  const fixHeight = fixRows && rowStartIndex <= fixRows && getCellsRangeSize({
    count: fixRows - rowStartIndex,
    meta: rows,
    startIndex: rowStartIndex,
    defaultSize: defaultRowHeight
  });

  const baseRootStyle = {
    position: 'absolute',
    top: top - scrollerTop,
    left: left - scrollerLeft,
    pointerEvents: 'none',
    ...style
  };

  const baseWrapperStyle = {
    position: 'sticky',
    overflow: 'hidden',
    top,
    left
  };

  const valueStyle = {
    width,
    height
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
      <div key="fix-row-column-0" style={rootStyle}>
        <div style={wrapperStyle}>
          <div style={valueStyle}>
            {children}
          </div>
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
      <div key="fix-column-1" style={rootStyle}>
        <div style={wrapperStyle}>
          <div style={valueStyle}>
            {children}
          </div>
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
      <div key="fix-row-2" style={rootStyle}>
        <div style={wrapperStyle}>
          <div style={valueStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Not fixed area
  elements.push((
    <div
        key="fix-cell-3"
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
    </div>
  ));

  return elements;

};

export default MergedCell;