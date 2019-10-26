import React, { createContext, useContext } from 'react';
import ScrollerContext from './ScrollerContext';

export const ScrollerRowContext = createContext();

const ScrollerRow = ({
  style,
  index,
  Component = 'div',
  ...props
}) => {
  const { rows, defaultRowHeight } = useContext(ScrollerContext);
  const height = (rows && rows[index].size) || defaultRowHeight;
  return (
    <ScrollerRowContext.Provider value={{ index, height }}>
      <Component {...props} style={{ ...style, height }} />
    </ScrollerRowContext.Provider>
  )
};

export default ScrollerRow;