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
const ScrollerCell = React.memo(({
  style,
  column = {},
  Component = 'div',
  ...props
}) => {
  const { defaultColumnWidth } = useContext(ScrollerContext);
  const { height, offset: rowOffset } = useContext(ScrollerRowContext);
  const { size, offset: columnOffset } = column;
  const width = size || defaultColumnWidth;
  let nextStyle = { height, width };
  if (columnOffset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.left = columnOffset;
    nextStyle.zIndex = 2;
  }
  if (rowOffset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.top = rowOffset;
    nextStyle.zIndex = 4;
  }
  if (columnOffset !== undefined && rowOffset !== undefined) {
    nextStyle.zIndex = 6;
  }
  nextStyle = { ...nextStyle, ...style }
  return <Component {...props} style={nextStyle} />;
});

export default ScrollerCell;