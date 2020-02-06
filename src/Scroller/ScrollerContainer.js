import React, { useMemo, forwardRef } from 'react';
import { ScrollerContext } from './';

/** @type {import('react').FunctionComponent<import('.').ScrollerContainerProps>} */
const ScrollerContainer = forwardRef(({
  coverRef,
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
}, ref) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth
  }), [defaultRowHeight, defaultColumnWidth]);
  return (
    <ScrollerContext.Provider value={contextValue}>
      <div ref={ref} onScroll={onScroll} className={className} style={{ width, height, overflow: 'auto', ...style }}>
        <div ref={coverRef} style={coverStyles}>
          <div style={pagesStyles}>
            <div style={gridStyles}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ScrollerContext.Provider>
  );
});

export default ScrollerContainer;