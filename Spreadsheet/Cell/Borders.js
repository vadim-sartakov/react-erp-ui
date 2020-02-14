import React, { useContext } from 'react';
import { SpreadsheetContext } from '../';
var borderSizeMap = {
  thin: 1,
  medium: 2,
  thick: 4
};

function getBorderStyle(borderStyle) {
  return borderStyle && "solid ".concat(borderSizeMap[borderStyle.style || 'thin'], "px ").concat(borderStyle.color || '#000000');
}

;

var Borders = function Borders(_ref) {
  var cell = _ref.cell;

  var _useContext = useContext(SpreadsheetContext),
      cellBorderColor = _useContext.cellBorderColor,
      hideGrid = _useContext.hideGrid;

  var defaultBorder = !hideGrid && {
    color: cellBorderColor
  };
  var style = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none'
  };
  var border = cell && cell.style && cell.style.border || {};
  style.borderTop = getBorderStyle(border.top);
  style.borderLeft = getBorderStyle(border.left);
  style.borderBottom = getBorderStyle(border.bottom || defaultBorder);
  style.borderRight = getBorderStyle(border.right || defaultBorder);
  return React.createElement("div", {
    style: style
  });
};

export default Borders;