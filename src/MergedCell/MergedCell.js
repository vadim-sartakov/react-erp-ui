import React from 'react';
import { getCellPosition, getCellsRangeSize } from '../utils/gridUtils';

export const visibleMergesFilter = ({
  fixRows,
  fixColumns,
  visibleRows,
  visibleColumns
}) => mergedRange => {
  return mergedRange.start.row < visibleRows[fixRows] || mergedRange.start.column < visibleColumns[fixColumns] ||
      (mergedRange.start.row <= visibleRows[visibleRows.length - 1] &&
          mergedRange.start.column <= visibleColumns[visibleColumns.length - 1] &&
          mergedRange.end.row >= visibleRows[fixRows] &&
          mergedRange.end.column >= visibleColumns[fixColumns]);
};

const MergedCell = ({
  defaultRowHeight,
  defaultColumnWidth,
  mergedRange,
  rowIndex,
  columnIndex,
  rows,
  columns,
  fixRows,
  fixColumns,
  scrollerTop,
  scrollerLeft,
  children
}) => { 
  const elements = [];

  const isFixedColumnArea = columnIndex <= fixColumns;
  const isFixedRowArea = rowIndex <= fixRows;
  
  const top = getCellPosition({
    meta: rows,
    index: rowIndex,
    defaultSize: defaultRowHeight
  });
  const left = getCellPosition({
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
      <div key={`fix-row-column-${rowIndex}-${columnIndex}`} style={rootStyle}>
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
      <div key={`fix-column-${rowIndex}-${columnIndex}`} style={rootStyle}>
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
      <div key={`fix-row-${rowIndex}-${columnIndex}`} style={rootStyle}>
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
        key={`fix-cell-${rowIndex}-${columnIndex}`}
        style={{
          position: 'absolute',
          top: top - scrollerTop,
          left: left - scrollerLeft,
          width,
          height,
          zIndex: 1
        }}>
      {children}
    </div>
  ));

  return elements;

};

export default MergedCell;