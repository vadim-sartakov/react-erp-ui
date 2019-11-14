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
  const height = useContext(ScrollerRowContext);
  const { size, offset } = column;
  const width = size || defaultColumnWidth;
  let nextStyle = { height, width };
  if (offset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.left = offset;
    nextStyle.zIndex = 2;
  }
  nextStyle = { ...nextStyle, ...style }
  return <Component {...props} style={nextStyle} />;
});

export default ScrollerCell;