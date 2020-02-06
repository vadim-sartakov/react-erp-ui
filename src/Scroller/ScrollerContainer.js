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
  className,
  onKeyDown
}, ref) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth
  }), [defaultRowHeight, defaultColumnWidth]);
  return (
    <ScrollerContext.Provider value={contextValue}>
      <div
          tabIndex="0"
          ref={ref}
          onScroll={onScroll}
          className={className}
          style={{ width, height, overflow: 'auto', ...style }}
          onKeyDown={onKeyDown}>
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