import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './SpecialCellEmptyArea.module.css';

var SpecialCellEmptyArea = function SpecialCellEmptyArea(props) {
  return React.createElement(SpreadsheetCell, Object.assign({
    className: classes.root
  }, props));
};

export default SpecialCellEmptyArea;