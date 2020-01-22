import React, { useMemo } from 'react';
import SpreadsheetContext from './SpreadsheetContext';

/**
 * @param {import('./').SpreadsheetContainerProps} props 
 */
const SpreadsheetContainer = ({
  onRowsChange,
  onColumnsChange,
  defaultColumnWidth,
  defaultRowHeight,
  groupSize,
  fixRows,
  fixColumns,
  specialRowsCount,
  specialColumnsCount,
  specialCellsBackgroundColor,
  scrollerTop,
  scrollerLeft,
  className,
  style,
  children
}) => {
  const contextValue = useMemo(() => ({
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    specialCellsBackgroundColor,
    fixRows,
    fixColumns,
    specialRowsCount,
    specialColumnsCount,
    scrollerTop,
    scrollerLeft
  }), [
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    specialCellsBackgroundColor,
    fixRows,
    fixColumns,
    specialRowsCount,
    specialColumnsCount,
    scrollerTop,
    scrollerLeft,
  ]);
  return (
    <SpreadsheetContext.Provider value={contextValue}>
      <div className={className} style={style}>
        {children}
      </div>
    </SpreadsheetContext.Provider>
  )
};

export default SpreadsheetContainer;