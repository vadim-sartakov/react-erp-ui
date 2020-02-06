import React, { useMemo, forwardRef } from 'react';
import { SpreadsheetContext } from './';

/** @type {import('react').FunctionComponent<import('.').SpreadsheetContainerProps>} */
const SpreadsheetContainer = forwardRef(({
  defaultColumnWidth,
  defaultRowHeight,
  groupSize,
  fixRows,
  fixColumns,
  className,
  style,
  onMouseDown,
  children
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
      <div ref={ref} className={className} style={{ ...style, userSelect: 'none' }} onMouseDown={onMouseDown}>
        {children}
      </div>
    </SpreadsheetContext.Provider>
  )
});

export default SpreadsheetContainer;