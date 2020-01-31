import React from 'react';

const borderSizeMap = {
  thin: 1,
  medium: 2,
  thick: 4
};

function getBorderStyle(borderStyle) {
  return borderStyle && `solid ${borderSizeMap[borderStyle.style || 'thin']}px ${borderStyle.color || '#000000'}`;
};

const Borders = ({ value }) => {
  if (!value || !value.border) return null;
  const style = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none'
  };
  if (value.border) {
    style.borderTop = getBorderStyle(value.border.top);
    style.borderLeft = getBorderStyle(value.border.left);
    style.borderBottom = getBorderStyle(value.border.bottom);
    style.borderRight = getBorderStyle(value.border.right);
  }
  return <div style={style} />;
};

export default Borders;