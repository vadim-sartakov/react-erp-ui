import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import { getCellPosition, getCellsRangeSize } from './utils';
export function normalizeMergedRange(mergedRange) {
  return {
    start: {
      row: Math.min(mergedRange.start.row, mergedRange.end.row),
      column: Math.min(mergedRange.start.column, mergedRange.end.column)
    },
    end: {
      row: Math.max(mergedRange.start.row, mergedRange.end.row),
      column: Math.max(mergedRange.start.column, mergedRange.end.column)
    }
  };
}
;

var MergedCell = function MergedCell(_ref) {
  var className = _ref.className,
      style = _ref.style,
      rootStyle = _ref.rootStyle,
      defaultRowHeight = _ref.defaultRowHeight,
      defaultColumnWidth = _ref.defaultColumnWidth,
      mergedRange = _ref.mergedRange,
      rows = _ref.rows,
      columns = _ref.columns,
      fixRows = _ref.fixRows,
      fixColumns = _ref.fixColumns,
      noPointerEvents = _ref.noPointerEvents,
      children = _ref.children,
      onMouseDown = _ref.onMouseDown,
      onMouseUp = _ref.onMouseUp,
      onMouseMove = _ref.onMouseMove,
      onClick = _ref.onClick;
  var elements = [];
  var normalizedMergedRange = normalizeMergedRange(mergedRange);
  var rowStartIndex = normalizedMergedRange.start.row;
  var columnStartIndex = normalizedMergedRange.start.column;
  var rowEndIndex = normalizedMergedRange.end.row;
  var columnEndIndex = normalizedMergedRange.end.column;
  var isFixedColumnArea = columnStartIndex <= fixColumns;
  var isFixedRowArea = rowStartIndex <= fixRows;
  var top = getCellPosition({
    meta: rows,
    index: rowStartIndex,
    defaultSize: defaultRowHeight
  });
  var left = getCellPosition({
    meta: columns,
    index: columnStartIndex,
    defaultSize: defaultColumnWidth
  });
  var width = getCellsRangeSize({
    count: columnEndIndex - columnStartIndex + 1,
    meta: columns,
    startIndex: columnStartIndex,
    defaultSize: defaultColumnWidth
  });
  var height = getCellsRangeSize({
    count: rowEndIndex - rowStartIndex + 1,
    meta: rows,
    startIndex: rowStartIndex,
    defaultSize: defaultRowHeight
  });
  var fixWidth = fixColumns && columnStartIndex <= fixColumns && getCellsRangeSize({
    count: fixColumns - columnStartIndex,
    meta: columns,
    startIndex: columnStartIndex,
    defaultSize: defaultColumnWidth
  });
  var fixHeight = fixRows && rowStartIndex <= fixRows && getCellsRangeSize({
    count: fixRows - rowStartIndex,
    meta: rows,
    startIndex: rowStartIndex,
    defaultSize: defaultRowHeight
  });

  var baseRootStyle = _objectSpread({}, rootStyle, {
    position: 'absolute',
    top: top,
    left: left,
    pointerEvents: 'none'
  });

  var baseWrapperStyle = {
    position: 'sticky',
    overflow: 'hidden',
    top: top,
    left: left,
    pointerEvents: noPointerEvents ? undefined : 'auto'
  };

  var valueStyle = _objectSpread({}, style, {
    width: width,
    height: height
  });

  if (isFixedRowArea && isFixedColumnArea) {
    var _rootStyle = _objectSpread({}, baseRootStyle, {
      width: "calc(100% - ".concat(left, "px)"),
      height: "calc(100% - ".concat(top, "px)"),
      zIndex: 7
    });

    var wrapperStyle = _objectSpread({}, baseWrapperStyle, {
      width: Math.min(fixWidth, width),
      height: Math.min(fixHeight, height)
    });

    elements.push(React.createElement("div", {
      key: "fix-row-column-0",
      style: _rootStyle
    }, React.createElement("div", {
      style: wrapperStyle
    }, React.createElement("div", {
      style: valueStyle,
      className: className,
      onMouseDown: onMouseDown,
      onMouseUp: onMouseUp,
      onMouseMove: onMouseMove,
      onClick: onClick
    }, children))));
  }

  if (isFixedColumnArea) {
    var _rootStyle2 = _objectSpread({}, baseRootStyle, {
      width: "calc(100% - ".concat(left, "px)"),
      height: height,
      zIndex: 3
    });

    var _wrapperStyle = _objectSpread({}, baseWrapperStyle, {
      width: Math.min(fixWidth, width),
      height: height
    });

    elements.push(React.createElement("div", {
      key: "fix-column-1",
      style: _rootStyle2
    }, React.createElement("div", {
      style: _wrapperStyle
    }, React.createElement("div", {
      style: valueStyle,
      className: className,
      onMouseDown: onMouseDown,
      onMouseUp: onMouseUp,
      onMouseMove: onMouseMove,
      onClick: onClick
    }, children))));
  }

  if (isFixedRowArea) {
    var _rootStyle3 = _objectSpread({}, baseRootStyle, {
      width: width,
      height: "calc(100% - ".concat(top, "px)"),
      zIndex: 5
    });

    var _wrapperStyle2 = _objectSpread({}, baseWrapperStyle, {
      width: width,
      height: Math.min(fixHeight, height)
    });

    elements.push(React.createElement("div", {
      key: "fix-row-2",
      style: _rootStyle3
    }, React.createElement("div", {
      style: _wrapperStyle2
    }, React.createElement("div", {
      style: valueStyle,
      className: className,
      onMouseDown: onMouseDown,
      onMouseUp: onMouseUp,
      onMouseMove: onMouseMove,
      onClick: onClick
    }, children))));
  } // Not fixed area


  elements.push(React.createElement("div", {
    key: "fix-cell-3",
    className: className,
    style: _objectSpread({}, rootStyle, {}, style, {
      pointerEvents: noPointerEvents ? 'none' : undefined,
      position: 'absolute',
      top: top,
      left: left,
      width: width,
      height: height,
      zIndex: 1
    }),
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onMouseMove: onMouseMove,
    onClick: onClick
  }, children));
  return elements;
};

export default MergedCell;