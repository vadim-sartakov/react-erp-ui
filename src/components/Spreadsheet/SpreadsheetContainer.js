import React, { useMemo } from 'react';
import SpreadsheetContext from './SpreadsheetContext';

/**
 * @typedef {import('react').HTMLAttributes} SpreadsheetContainerProps
 * @property {function} onRowsChange
 * @property {function} onColumnsChange
 * @property {number} defaultColumnWidth
 * @property {number} defaultRowHeight
 * @property {number} fixRows
 * @property {number} fixColumns
 */

const SpreadsheetContainer = ({
  onRowsChange,
  onColumnsChange,
  defaultColumnWidth,
  defaultRowHeight,
  fixRows,
  fixColumns,
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
    fixColumns
  }), [onRowsChange, onColumnsChange, defaultColumnWidth, defaultRowHeight, fixRows, fixColumns]);
  return (
    <SpreadsheetContext.Provider
        value={contextValue}>
      <div className={className} style={style}>
        {children}
      </div>
    </SpreadsheetContext.Provider>
  )
};

export default SpreadsheetContainer;