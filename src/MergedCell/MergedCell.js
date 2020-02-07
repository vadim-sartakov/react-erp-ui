import React from 'react';
import { getCellPosition, getCellsRangeSize } from '../utils/gridUtils';

export function normalizeMergedRange(mergedRange) {
  return {
    start: {
      row: Math.min(mergedRange.start.row, mergedRange.end.row),
      column: Math.min(mergedRange.start.column, mergedRange.end.column)
    },
    end: {
      row: Math.max(mergedRange.start.row, mergedRange.end.row),
      column: Math.max(mergedRange.start.column, mergedRange.end.column)
    }
  }
};

const MergedCell = ({
  className,
  style,
  rootStyle,
  defaultRowHeight,
  defaultColumnWidth,
  mergedRange,
  rows,
  columns,
  fixRows,
  fixColumns,
  noPointerEvents,
  children,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onClick
}) => { 
  const elements = [];

  const normalizedMergedRange = normalizeMergedRange(mergedRange);

  const rowStartIndex = normalizedMergedRange.start.row;
  const columnStartIndex = normalizedMergedRange.start.column;

  const rowEndIndex = normalizedMergedRange.end.row;
  const columnEndIndex = normalizedMergedRange.end.column;

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
    ...rootStyle,
    position: 'absolute',
    top: top,
    left: left,
    pointerEvents: 'none'
  };

  const baseWrapperStyle = {
    position: 'sticky',
    overflow: 'hidden',
    top,
    left,
    pointerEvents: noPointerEvents ? undefined : 'auto'
  };

  const valueStyle = {
    ...style,
    width,
    height
  };

  if (isFixedRowArea && isFixedColumnArea) {
    const rootStyle = {
      ...baseRootStyle,
      width: `calc(100% - ${left}px)`,
      height: `calc(100% - ${top}px)`,
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
          <div
              style={valueStyle}
              className={className}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onClick={onClick}>
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (isFixedColumnArea) {
    const rootStyle = {
      ...baseRootStyle,
      width: `calc(100% - ${left}px)`,
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
          <div
              style={valueStyle}
              className={className}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onClick={onClick}>
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
      height: `calc(100% - ${top}px)`,
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
          <div
              style={valueStyle}
              className={className}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onClick={onClick}>
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
        className={className}
        style={{
          ...rootStyle,
          ...style,
          pointerEvents: noPointerEvents ? 'none' : undefined,
          position: 'absolute',
          top,
          left,
          width,
          height,
          zIndex: 1
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClick={onClick}>
      {children}
    </div>
  ));

  return elements;

};

export default MergedCell;