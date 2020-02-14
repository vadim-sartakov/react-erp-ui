import React from 'react';

var ResizeLinesView = function ResizeLinesView(_ref) {
  var type = _ref.type,
      style = _ref.style;
  var className = type === 'row' ? 'resize-line-row' : 'resize-line-column';
  return React.createElement("div", {
    className: className,
    style: style
  });
};

export default ResizeLinesView;