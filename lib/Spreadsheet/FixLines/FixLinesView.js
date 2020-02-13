import React from 'react';

var FixLinesView = function FixLinesView(_ref) {
  var type = _ref.type,
      style = _ref.style;
  var className = type === 'rows' ? 'fixed-rows' : 'fixed-columns';
  return React.createElement("div", {
    className: className,
    style: style
  });
};

export default FixLinesView;