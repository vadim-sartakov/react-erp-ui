import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';

var HeadingsIntersection = function HeadingsIntersection(_ref) {
  var row = _ref.row,
      column = _ref.column;
  return React.createElement(SpreadsheetCell, {
    className: "heading-cell",
    row: row,
    column: column
  });
};

export default HeadingsIntersection;