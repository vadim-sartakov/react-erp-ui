import React from 'react';
import classes from './FixLinesView.module.css';

var FixLinesView = function FixLinesView(_ref) {
  var type = _ref.type,
      style = _ref.style;
  var className = type === 'rows' ? classes.fixedRows : classes.fixedColumns;
  return React.createElement("div", {
    className: className,
    style: style
  });
};

export default FixLinesView;