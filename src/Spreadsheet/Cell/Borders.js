import React, { useContext } from 'react';
import { SpreadsheetContext } from '../'

const borderSizeMap = {
  thin: 1,
  medium: 2,
  thick: 4
};

function getBorderStyle(borderStyle) {
  return borderStyle && `solid ${borderSizeMap[borderStyle.style || 'thin']}px ${borderStyle.color || '#000000'}`;
};

const Borders = ({ cell }) => {
  const { cellBorderColor, hideGrid } = useContext(SpreadsheetContext);
  const defaultBorder = !hideGrid && { color: cellBorderColor };

  const style = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none'
  };
  const border = (cell && cell.style && cell.style.border) || {};
  style.borderTop = getBorderStyle(border.top);
  style.borderLeft = getBorderStyle(border.left);
  style.borderBottom = getBorderStyle(border.bottom || defaultBorder);
  style.borderRight = getBorderStyle(border.right || defaultBorder);
  return <div style={style} />;
};

export default Borders;