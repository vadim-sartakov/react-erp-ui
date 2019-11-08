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
const ScrollerRow = React.memo(({
  style,
  row,
  offset,
  Component = 'div',
  ...props
}) => {
  const { defaultRowHeight } = useContext(ScrollerContext);
  const height = (row && row.size) || defaultRowHeight;
  const nextStyle = { ...style, height };
  if (offset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.top = offset;
    nextStyle.zIndex = 2;
  }
  return (
    <ScrollerRowContext.Provider value={height}>
      <Component {...props} style={nextStyle} />
    </ScrollerRowContext.Provider>
  )
});

export default ScrollerRow;