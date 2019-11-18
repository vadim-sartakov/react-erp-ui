import React, { useMemo } from 'react';
import ScrollContext from './ScrollerContext';

/**
 * @typedef {Object} Meta
 * @property {number} size
 */

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
 * @property {number[]} rowsOffsets
 * @property {number[]} columnsOffsets
 * @property {function} onScroll
 * @property {number[]} rowsOffsets
 * @property {number[]} columnsOffsets
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
  rowsOffsets,
  columnsOffsets,
  onScroll,
  coverStyles,
  pagesStyles,
  ...props
}) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth,
    pagesStyles
  }), [defaultRowHeight, defaultColumnWidth, pagesStyles]);
  return (
    <ScrollContext.Provider value={contextValue}>
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