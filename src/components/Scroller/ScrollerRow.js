import React, { createContext, useContext } from 'react';
import ScrollerContext from './ScrollerContext';

export const ScrollerRowContext = createContext();

/**
 * @typedef {Object} ScrollerRowProps
 * @property {string | *} Component - React Component
 * @property {number} index - Row index
 * 
 * @param {ScrollerRowProps} props
 */
const ScrollerRow = ({
  style,
  index,
  relativeIndex,
  Component = 'div',
  ...props
}) => {
  const { rows, defaultRowHeight, rowsOffsets } = useContext(ScrollerContext);
  const height = (rows && rows[index].size) || defaultRowHeight;
  const nextStyle = { ...style, height };
  const offset = rowsOffsets[relativeIndex];
  if (offset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.top = offset;
    nextStyle.zIndex = 2;
  }
  return (
    <ScrollerRowContext.Provider value={{ index, height }}>
      <Component {...props} style={nextStyle} />
    </ScrollerRowContext.Provider>
  )
};

export default ScrollerRow;