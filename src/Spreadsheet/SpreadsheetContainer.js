import React, { useMemo } from 'react';
import { SpreadsheetContext } from './';

/** @type {import('react').FunctionComponent<import('.').SpreadsheetContainerProps>} */
const SpreadsheetContainer = ({
  defaultColumnWidth,
  defaultRowHeight,
  groupSize,
  fixRows,
  fixColumns,
  scrollerTop,
  scrollerLeft,
  className,
  style,
  children
}) => {
  const contextValue = useMemo(() => ({
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    fixRows,
    fixColumns,
    scrollerTop,
    scrollerLeft
  }), [
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    fixRows,
    fixColumns,
    scrollerTop,
    scrollerLeft
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