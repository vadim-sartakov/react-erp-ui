import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useContext } from 'react';
import { SpreadsheetContext } from '..';
import FixLinesView from './FixLinesView';
import { getCellsRangeSize } from '../../utils/gridUtils';

var FixLines = function FixLines(_ref) {
  var _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? FixLinesView : _ref$Component,
      rows = _ref.rows,
      columns = _ref.columns,
      specialRowsCount = _ref.specialRowsCount,
      specialColumnsCount = _ref.specialColumnsCount;
  var result = [];

  var _useContext = useContext(SpreadsheetContext),
      defaultRowHeight = _useContext.defaultRowHeight,
      defaultColumnWidth = _useContext.defaultColumnWidth,
      fixRows = _useContext.fixRows,
      fixColumns = _useContext.fixColumns;

  var containerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    zIndex: 10
  };
  var baseFixedAreaStyle = {
    position: 'sticky',
    top: 0,
    left: 0
  };

  if (fixColumns - specialColumnsCount) {
    var width = getCellsRangeSize({
      startIndex: 0,
      count: fixColumns,
      defaultSize: defaultColumnWidth,
      meta: columns
    });

    var style = _objectSpread({}, baseFixedAreaStyle, {
      width: width,
      height: '100%'
    });

    result.push(React.createElement("div", {
      key: "fixed_columns",
      style: containerStyle
    }, React.createElement(Component, {
      type: "columns",
      style: style
    })));
  }

  if (fixRows - specialRowsCount) {
    var height = getCellsRangeSize({
      startIndex: 0,
      count: fixRows,
      defaultSize: defaultRowHeight,
      meta: rows
    });

    var _style = _objectSpread({}, baseFixedAreaStyle, {
      width: '100%',
      height: height
    });

    result.push(React.createElement("div", {
      key: "fixed_rows",
      style: containerStyle
    }, React.createElement(Component, {
      type: "rows",
      style: _style
    })));
  }

  return result;
};

export default FixLines;