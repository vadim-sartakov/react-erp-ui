import React, { useContext } from 'react';
import { ScrollerRowContext } from './ScrollerRow';
import ScrollerContext from './ScrollerContext';

const ScrollerCell = ({
  style,
  index: columnIndex,
  Component = 'div',
  ...props
}) => {
  const { columns, defaultColumnWidth } = useContext(ScrollerContext);
  const { height } = useContext(ScrollerRowContext);
  const width = (columns && columns[columnIndex].size) || defaultColumnWidth;
  return <Component {...props} style={{ ...style, height, width }} />;
};

export default ScrollerCell;