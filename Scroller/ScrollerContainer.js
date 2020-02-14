import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useMemo, forwardRef } from 'react';
import { ScrollerContext } from './';
/** @type {import('react').FunctionComponent<import('.').ScrollerContainerProps>} */

var ScrollerContainer = forwardRef(function (_ref, ref) {
  var width = _ref.width,
      height = _ref.height,
      style = _ref.style,
      defaultRowHeight = _ref.defaultRowHeight,
      defaultColumnWidth = _ref.defaultColumnWidth,
      props = _objectWithoutProperties(_ref, ["width", "height", "style", "defaultRowHeight", "defaultColumnWidth"]);

  var contextValue = useMemo(function () {
    return {
      defaultRowHeight: defaultRowHeight,
      defaultColumnWidth: defaultColumnWidth
    };
  }, [defaultRowHeight, defaultColumnWidth]);
  return React.createElement(ScrollerContext.Provider, {
    value: contextValue
  }, React.createElement("div", Object.assign({
    tabIndex: "0",
    ref: ref
  }, props, {
    style: _objectSpread({
      width: width,
      height: height,
      overflow: height && 'auto'
    }, style)
  })));
});
export default ScrollerContainer;