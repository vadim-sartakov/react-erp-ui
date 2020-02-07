import React, { useMemo, forwardRef } from 'react';
import { SpreadsheetContext } from './';

/** @type {import('react').FunctionComponent<import('.').SpreadsheetContainerProps>} */
const SpreadsheetContainer = forwardRef(({
  defaultColumnWidth,
  defaultRowHeight,
  groupSize,
  fixRows,
  fixColumns,
  style,
  ...props
}, ref) => {
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
      <div ref={ref} {...props} style={{ ...style, userSelect: 'none' }} />
    </SpreadsheetContext.Provider>
  )
});

export default SpreadsheetContainer;