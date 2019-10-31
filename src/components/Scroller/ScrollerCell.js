import React, { useContext } from 'react';
import { ScrollerRowContext } from './ScrollerRow';
import ScrollerContext from './ScrollerContext';

/**
 * @typedef {Object} ScrollerCellProps
 * @property {string | *} Component - React Component
 * @property {number} index - Column index
 * 
 * @param {ScrollerCellProps} props
 */
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