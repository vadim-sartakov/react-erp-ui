import React from 'react';

const borderSizeMap = {
  thin: 1,
  medium: 2,
  thick: 4
};

function getBorderStyle(borderStyle) {
  return borderStyle && `solid ${borderSizeMap[borderStyle.style || 'thin']}px ${borderStyle.color || '#000000'}`;
};

const Borders = ({ cell }) => {
  if (!cell || !cell.style || !cell.style.border) return null;
  const style = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none'
  };
  const border = cell.style.border;
  style.borderTop = getBorderStyle(border.top);
  style.borderLeft = getBorderStyle(border.left);
  style.borderBottom = getBorderStyle(border.bottom);
  style.borderRight = getBorderStyle(border.right);
  return <div style={style} />;
};

export default Borders;