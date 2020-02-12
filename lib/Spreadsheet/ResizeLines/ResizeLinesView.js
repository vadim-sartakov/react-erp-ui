import React from 'react';
import classes from './ResizeLines.module.css';

var ResizeLinesView = function ResizeLinesView(_ref) {
  var type = _ref.type,
      style = _ref.style;
  var className = type === 'row' ? classes.row : classes.column;
  return React.createElement("div", {
    className: className,
    style: style
  });
};

export default ResizeLinesView;