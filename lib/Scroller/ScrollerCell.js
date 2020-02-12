import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useContext } from 'react';
import { ScrollerContext } from './';
/** @type {import('react').FunctionComponent<import('.').ScrollerCellProps>} */

var ScrollerCell = function ScrollerCell(_ref) {
  var className = _ref.className,
      style = _ref.style,
      row = _ref.row,
      column = _ref.column,
      _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? 'div' : _ref$Component,
      children = _ref.children,
      onMouseDown = _ref.onMouseDown,
      onMouseUp = _ref.onMouseUp,
      onMouseMove = _ref.onMouseMove,
      onClick = _ref.onClick;

  var _useContext = useContext(ScrollerContext),
      defaultColumnWidth = _useContext.defaultColumnWidth,
      defaultRowHeight = _useContext.defaultRowHeight;

  var _ref2 = row || {},
      rowSize = _ref2.size,
      rowOffset = _ref2.offset;

  var _ref3 = column || {},
      columnSize = _ref3.size,
      columnOffset = _ref3.offset;

  var width = columnSize || defaultColumnWidth;
  var height = rowSize || defaultRowHeight;
  var nextStyle = {
    height: height,
    width: width
  };

  if (columnOffset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.left = columnOffset;
    nextStyle.zIndex = 2;
  }

  if (rowOffset !== undefined) {
    nextStyle.position = 'sticky';
    nextStyle.top = rowOffset;
    nextStyle.zIndex = 4;
  }

  if (columnOffset !== undefined && rowOffset !== undefined) {
    nextStyle.zIndex = 6;
  }

  nextStyle = _objectSpread({}, nextStyle, {}, style);
  return React.createElement(Component, {
    style: nextStyle,
    className: className,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onMouseMove: onMouseMove,
    onClick: onClick
  }, children);
};

export default ScrollerCell;