import React from 'react';
import ScrollContext from './ScrollerContext';

const ScrollContainer = ({
  width,
  height,
  children,
  coverProps,
  pagesProps,
  style,
  defaultRowHeight,
  defaultColumnWidth,
  rows,
  columns,
  onScroll,
  coverStyles,
  pagesStyles,
  ...props
}) => {
  return (
    <ScrollContext.Provider value={{
      defaultRowHeight,
      defaultColumnWidth,
      rows,
      columns
    }}>
      <div onScroll={onScroll} {...props} style={{ width, height, overflow: 'auto', ...style }}>
        <div {...coverProps} style={{ ...(coverProps && coverProps.styles), ...coverStyles }}>
          <div {...pagesProps} style={{ ...(pagesProps && pagesProps.pages), ...pagesStyles }}>
            {children}
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

export default ScrollContainer;