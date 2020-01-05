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
  fixRows,
  fixColumns,
  specialRowsCount,
  specialColumnsCount,
  className,
  style,
  children
}) => {
  const contextValue = useMemo(() => ({
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    fixRows,
    fixColumns,
    specialRowsCount,
    specialColumnsCount
  }), [
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    fixRows,
    fixColumns,
    specialRowsCount,
    specialColumnsCount
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