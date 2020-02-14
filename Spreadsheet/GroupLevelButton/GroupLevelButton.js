import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';

var GroupLevelButton = function GroupLevelButton(_ref) {
  var index = _ref.index,
      row = _ref.row,
      column = _ref.column,
      onClick = _ref.onClick;
  return React.createElement(SpreadsheetCell, {
    row: row,
    column: column,
    className: "group-button-container",
    style: {
      zIndex: 8
    }
  }, React.createElement("div", {
    className: "group-button",
    onClick: onClick
  }, index + 1));
};

export default GroupLevelButton;