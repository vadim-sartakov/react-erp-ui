import React, { useMemo } from 'react';
import ScrollContext from './ScrollerContext';
import './types';

/**
 * @function
 * @memberof module:components/Scroller
 * @param {ScrollerContainerProps} props [ScrollerContainerProps]{@link module:components/Scroller~ScrollerContainerProps}
 */
const ScrollerContainer = ({
  width,
  height,
  children,
  coverProps,
  pagesProps,
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
        <div {...coverProps} style={{ ...(coverProps && coverProps.styles), ...coverStyles }}>
          <div {...pagesProps} style={{ ...(pagesProps && pagesProps.pages), ...pagesStyles }}>
            {children}
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

export default ScrollerContainer;