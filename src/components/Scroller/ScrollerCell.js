import React, { useContext } from 'react';
import ScrollerContext from './ScrollerContext';
import './useScroller';
import './types';

/**
 * @function
 * @memberof module:components/Scroller
 * @param {ScrollerCellProps} props [ScrollerCellProps]{@link module:components/Scroller~ScrollerCellProps}
 */
const ScrollerCell = React.memo(({
  style = {},
  row = {},
  column = {},
  Component = 'div',
  ...props
}) => {
  const { defaultColumnWidth, defaultRowHeight } = useContext(ScrollerContext);
  const { size: rowSize, offset: rowOffset } = row;
  const { size: columnSize, offset: columnOffset } = column;
  const width = style.width || columnSize || defaultColumnWidth;
  const height = style.height || rowSize || defaultRowHeight;
  let nextStyle = { ...style, height, width };
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
  return <Component {...props} style={nextStyle} />;
});

export default ScrollerCell;