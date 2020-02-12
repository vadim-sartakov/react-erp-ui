import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useRef } from 'react';
import { useScroller, ScrollerContainer } from './';
/** @type {import('react').FunctionComponent<import('.').ScrollerProps>} */

var Scroller = function Scroller(inputProps) {
  var scrollerContainerRef = useRef();
  var scrollerProps = useScroller(_objectSpread({}, inputProps, {
    scrollerContainerRef: scrollerContainerRef
  }));

  var props = _objectSpread({}, inputProps, {}, scrollerProps);

  var CellComponent = props.CellComponent;
  var elements = props.visibleRows.reduce(function (acc, rowIndex) {
    var row = props.rows && props.rows[rowIndex];

    if (props.visibleColumns) {
      var columnsElements = props.visibleColumns.map(function (columnIndex) {
        var column = props.columns && props.columns[columnIndex];
        var valueArray = props.loadedValues || props.value;
        var curValue = valueArray[rowIndex] && valueArray[rowIndex][columnIndex];
        var cellProps = {
          row: row,
          column: column,
          rowIndex: rowIndex,
          columnIndex: columnIndex,
          value: curValue
        };
        return React.createElement(CellComponent, Object.assign({
          key: "".concat(rowIndex, "-").concat(columnIndex)
        }, cellProps));
      });
      return [].concat(_toConsumableArray(acc), _toConsumableArray(columnsElements));
    } else {
      var valueArray = props.loadedValues || props.value;
      var curValue = valueArray[rowIndex];
      var cellProps = {
        row: row,
        rowIndex: rowIndex,
        value: curValue
      };
      var rowElement = React.createElement(CellComponent, Object.assign({
        key: rowIndex
      }, cellProps));
      return [].concat(_toConsumableArray(acc), [rowElement]);
    }
  }, []);
  return React.createElement(ScrollerContainer, {
    ref: scrollerContainerRef,
    defaultRowHeight: props.defaultRowHeight,
    defaultColumnWidth: props.defaultColumnWidth,
    onScroll: props.onScroll,
    width: props.width,
    height: props.height
  }, React.createElement("div", {
    style: props.coverStyles
  }, React.createElement("div", {
    style: props.pagesStyles
  }, React.createElement("div", {
    style: props.gridStyles
  }, elements))));
};

export default Scroller;