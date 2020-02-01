import React, { useMemo } from 'react';
import { SpreadsheetContext } from './';

/** @type {import('react').FunctionComponent<import('.').SpreadsheetContainerProps>} */
const SpreadsheetContainer = ({
  defaultColumnWidth,
  defaultRowHeight,
  groupSize,
  fixRows,
  fixColumns,
  className,
  style,
  children
}) => {
  const contextValue = useMemo(() => ({
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    fixRows,
    fixColumns
  }), [
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    fixRows,
    fixColumns
  ]);
  return (
    <SpreadsheetContext.Provider value={contextValue}>
      <div className={className} style={{ ...style, userSelect: 'none' }}>
        {children}
      </div>
    </SpreadsheetContext.Provider>
  )
};

export default SpreadsheetContainer;