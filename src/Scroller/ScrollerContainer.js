import React, { useMemo } from 'react';
import ScrollContext from './ScrollerContext';

/** @type {import('.').ScrollerContainer} */
const ScrollerContainer = ({
  width,
  height,
  children,
  style,
  defaultRowHeight,
  defaultColumnWidth,
  onScroll,
  coverStyles,
  pagesStyles,
  gridStyles,
  className
}) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth
  }), [defaultRowHeight, defaultColumnWidth]);
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