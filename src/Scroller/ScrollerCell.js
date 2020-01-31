import React, { useContext } from 'react';
import { ScrollerContext } from './';

/** @type {import('react').FunctionComponent<import('.').ScrollerCellProps>} */
const ScrollerCell = ({
  style,
  row,
  column,
  children
}) => {
  const { defaultColumnWidth, defaultRowHeight } = useContext(ScrollerContext);
  
  const { size: rowSize, offset: rowOffset } = row || {};
  const { size: columnSize, offset: columnOffset } = column || {};
  const width = columnSize || defaultColumnWidth;
  const height = rowSize || defaultRowHeight;
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
  nextStyle = { ...nextStyle, ...style };
  return (
    <div style={nextStyle}>
      {children}
    </div>
  );
};

export default ScrollerCell;