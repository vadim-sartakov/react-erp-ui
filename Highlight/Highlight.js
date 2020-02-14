import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import React from 'react';
import classNames from 'classnames';

var Highlight = function Highlight(_ref) {
  var search = _ref.search,
      highlightClassName = _ref.highlightClassName,
      children = _ref.children;
  var parts = children.split(new RegExp("(".concat(search, ")"), 'gi'));
  return React.createElement("span", null, parts.filter(function (part) {
    return part !== '';
  }).map(function (part, index) {
    return React.createElement("span", {
      key: index,
      className: classNames(_defineProperty({}, highlightClassName, part.toLowerCase() === search.toLowerCase()))
    }, part);
  }));
};

Highlight.defaultProps = {
  highlightClassName: 'highlight'
};
export default Highlight;