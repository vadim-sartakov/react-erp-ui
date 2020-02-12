import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './Heading.module.css';

var HeadingsIntersection = function HeadingsIntersection(_ref) {
  var row = _ref.row,
      column = _ref.column;
  return React.createElement(SpreadsheetCell, {
    className: classes.cell,
    row: row,
    column: column
  });
};

export default HeadingsIntersection;