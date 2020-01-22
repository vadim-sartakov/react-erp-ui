import React, { useMemo } from 'react';
import ScrollContext from './ScrollerContext';

/** @type {import('.').ScrollerContainer<import('.').ScrollerContainerProps>} */
const ScrollerContainer = ({
  width,
  height,
  children,
  style,
  defaultRowHeight,
  defaultColumnWidth,
  rows,
  columns,
  onScroll,
  coverStyles,
  pagesStyles,
  gridStyles,
  className
}) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth,
    rows,
    columns
  }), [defaultRowHeight, defaultColumnWidth, rows, columns]);
  return (
    <ScrollContext.Provider value={contextValue}>
      <div onScroll={onScroll} className={className} style={{ width, height, overflow: 'auto', ...style }}>
        <div style={coverStyles}>
          <div style={pagesStyles}>
            <div style={gridStyles}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

export default ScrollerContainer;