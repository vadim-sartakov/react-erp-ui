import React, { useMemo } from 'react';
import ScrollContext from './ScrollerContext';

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
  className
}) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth,
    pagesStyles
  }), [defaultRowHeight, defaultColumnWidth, pagesStyles]);
  return (
    <ScrollContext.Provider value={contextValue}>
      <div onScroll={onScroll} className={className} style={{ width, height, overflow: 'auto', ...style }}>
        <div style={coverStyles}>
          <div style={pagesStyles}>
            {children}
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

export default ScrollerContainer;