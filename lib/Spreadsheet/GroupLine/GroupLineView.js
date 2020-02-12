import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './GroupLine.module.css';

var GroupLineView = function GroupLineView(_ref) {
  var type = _ref.type,
      backgroundColor = _ref.backgroundColor,
      containerStyle = _ref.containerStyle,
      lineStyle = _ref.lineStyle,
      collapsed = _ref.collapsed,
      onButtonClick = _ref.onButtonClick,
      props = _objectWithoutProperties(_ref, ["type", "backgroundColor", "containerStyle", "lineStyle", "collapsed", "onButtonClick"]);

  var lineClassName;

  switch (type) {
    case 'row':
      lineClassName = classes.verticalLine;
      break;

    case 'column':
      lineClassName = classes.horizontalLine;
      break;

    default:
  }

  return React.createElement(SpreadsheetCell, Object.assign({
    className: classes.root
  }, props), React.createElement("div", {
    className: classes.buttonContainer,
    style: _objectSpread({}, containerStyle, {
      backgroundColor: backgroundColor
    })
  }, React.createElement("div", {
    className: classes.groupButton,
    style: {
      backgroundColor: backgroundColor
    },
    onClick: onButtonClick
  }, collapsed ? '+' : '-')), !collapsed && React.createElement("div", {
    className: lineClassName,
    style: lineStyle
  }));
};

export default GroupLineView;