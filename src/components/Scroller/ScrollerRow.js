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
  row = {},
  Component = 'div',
  ...props
}) => {
  const { defaultRowHeight } = useContext(ScrollerContext);
  const { size, offset } = row;
  const height = size || defaultRowHeight;
  const nextStyle = { ...style, height };
  return (
    <ScrollerRowContext.Provider value={{ height, offset }}>
      <Component {...props} style={nextStyle} />
    </ScrollerRowContext.Provider>
  )
});

export default ScrollerRow;