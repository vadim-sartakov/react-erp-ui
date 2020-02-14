import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';

var SpecialCellEmptyArea = function SpecialCellEmptyArea(props) {
  return React.createElement(SpreadsheetCell, Object.assign({
    className: "special-cell-empty-area"
  }, props));
};

export default SpecialCellEmptyArea;