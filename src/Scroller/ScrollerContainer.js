import React, { useMemo } from 'react';
import { ScrollerContext } from './';

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
    <ScrollerContext.Provider value={contextValue}>
      <div onScroll={onScroll} className={className} style={{ width, height, overflow: 'auto', ...style }}>
        <div style={coverStyles}>
          <div style={pagesStyles}>
            <div style={gridStyles}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ScrollerContext.Provider>
  );
};

export default ScrollerContainer;