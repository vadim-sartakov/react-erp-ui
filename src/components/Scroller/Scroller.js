import React from 'react';
import ScrollContext from './ScrollerContext';

/**
 * @typedef {Object} ScrollerProps
 * @property {number} [width]
 * @property {number} height
 * @property {import('react').HTMLAttributes} coverProps
 * @property {import('react').HTMLAttributes} pagesProps
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {number[]} rows
 * @property {number[]} columns
 * @property {function} onScroll
 * @property {import('react').CSSProperties} coverStyles
 * @property {import('react').CSSProperties} pagesStyles
 * 
 * @param {ScrollerProps} props 
 */
const Scroller = ({
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

export default Scroller;