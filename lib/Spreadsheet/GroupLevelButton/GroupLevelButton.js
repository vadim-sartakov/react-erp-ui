import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './GroupLevelButton.module.css';

var GroupLevelButton = function GroupLevelButton(_ref) {
  var index = _ref.index,
      row = _ref.row,
      column = _ref.column,
      onClick = _ref.onClick;
  return React.createElement(SpreadsheetCell, {
    row: row,
    column: column,
    className: classes.groupButtonContainer,
    style: {
      zIndex: 8
    }
  }, React.createElement("div", {
    className: classes.groupButton,
    onClick: onClick
  }, index + 1));
};

export default GroupLevelButton;