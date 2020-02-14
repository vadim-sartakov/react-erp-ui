import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import Borders from './Borders';
var flexAlignValuesMap = {
  top: 'flex-start',
  left: 'flex-start',
  middle: 'center',
  center: 'center',
  bottom: 'flex-end',
  right: 'flex-end'
};
var Cell = React.memo(function (props) {
  var fixRows = props.fixRows,
      fixColumns = props.fixColumns,
      row = props.row,
      column = props.column,
      rowIndex = props.rowIndex,
      columnIndex = props.columnIndex,
      cell = props.cell,
      Component = props.Component;
  var rowStyle = row && row.style || {};
  var columnStyle = column && column.style || {};
  var valueStyle = cell && cell.style || {};

  var resultStyle = _objectSpread({}, columnStyle, {}, rowStyle, {}, valueStyle);

  var componentStyle = {
    display: 'flex',
    overflow: 'hidden'
  };
  componentStyle.alignItems = resultStyle.verticalAlign && flexAlignValuesMap[resultStyle.verticalAlign] || 'flex-end';
  if (resultStyle.horizontalAlign) componentStyle.justifyContent = flexAlignValuesMap[resultStyle.horizontalAlign];
  if (!resultStyle.wrapText) componentStyle.whiteSpace = 'nowrap';
  if (resultStyle.fill) componentStyle.backgroundColor = resultStyle.fill;

  if (resultStyle.font) {
    if (resultStyle.font.color) componentStyle.color = resultStyle.font.color;
    if (resultStyle.font.name) componentStyle.fontFamily = resultStyle.font.name;
    if (resultStyle.font.size) componentStyle.fontSize = resultStyle.font.size;
    if (resultStyle.font.bold) componentStyle.fontWeight = 'bold';
    if (resultStyle.font.italic) componentStyle.fontStyle = 'italic';
  }

  if (rowIndex >= fixRows && columnIndex >= fixColumns) componentStyle.position = 'relative';
  return React.createElement(Component, Object.assign({}, props, {
    style: componentStyle,
    cell: cell,
    className: "value-cell"
  }), React.createElement(Borders, {
    cell: cell
  }));
});
export default Cell;