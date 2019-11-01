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
  relativeIndex,
  Component = 'div',
  ...props
}) => {
  const { columns, defaultColumnWidth, columnsOffsets } = useContext(ScrollerContext);
  const { height } = useContext(ScrollerRowContext);
  const width = (columns && columns[columnIndex].size) || defaultColumnWidth;
  const nextStyle = { ...style, height, width };
  const offset = columnsOffsets[relativeIndex];
  if (offset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.left = offset;
    nextStyle.zIndex = 1;
  }
  return <Component {...props} style={nextStyle} />;
};

export default ScrollerCell;