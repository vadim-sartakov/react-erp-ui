import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _slicedToArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import classNames from 'classnames';
export var TableScrollContext = createContext(); // Extract it as generic scroll component
// Got to set margins depending on content size

export var TableScroll = function TableScroll(_ref) {
  var scrollTop = _ref.scrollTop,
      scrollLeft = _ref.scrollLeft,
      rowsPerPage = _ref.rowsPerPage,
      columnsPerPage = _ref.columnsPerPage,
      widths = _ref.widths,
      heights = _ref.heights,
      defaultWidth = _ref.defaultWidth,
      defaultHeight = _ref.defaultHeight,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["scrollTop", "scrollLeft", "rowsPerPage", "columnsPerPage", "widths", "heights", "defaultWidth", "defaultHeight", "children"]);

  var scrollRef = useRef();
  useEffect(function () {
    scrollRef.current.scrollTop = scrollTop;
  }, [scrollTop]);
  useEffect(function () {
    scrollRef.current.scrollLeft = scrollLeft;
  }, [scrollLeft]);

  var handleScroll = function handleScroll(e) {};

  var visibleValues = {
    columns: {
      pages: [0, 1],
      children: [{
        pages: [0, 1],
        expanded: true
      }]
    },
    rows: {
      pages: [0]
    }
  };
  return React.createElement("div", Object.assign({}, props, {
    ref: scrollRef,
    onScroll: handleScroll
  }), children(visibleValues));
};
TableScroll.defaultProps = {
  scrollTop: 0,
  scrollLeft: 0
};
var TableContext = createContext();
export var Table = function Table(_ref2) {
  var defaultRowHeight = _ref2.defaultRowHeight,
      defaultColumnWidth = _ref2.defaultColumnWidth,
      fixRows = _ref2.fixRows,
      fixColumns = _ref2.fixColumns,
      classes = _ref2.classes,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      value = _ref2.value,
      props = _objectWithoutProperties(_ref2, ["defaultRowHeight", "defaultColumnWidth", "fixRows", "fixColumns", "classes", "style", "value"]);

  // Got to be hierarchical
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      widths = _useState2[0],
      setWidths = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      heights = _useState4[0],
      setHeights = _useState4[1];

  return React.createElement(TableContext.Provider, {
    value: {
      defaultRowHeight: defaultRowHeight,
      defaultColumnWidth: defaultColumnWidth,
      fixRows: fixRows,
      fixColumns: fixColumns,
      classes: classes,
      widths: [widths, setWidths],
      heights: [heights, setHeights]
    }
  }, React.createElement("table", Object.assign({}, props, {
    style: _objectSpread({}, style, {
      tableLayout: 'fixed',
      width: 'min-content'
    })
  })));
};
Table.defaultProps = {
  defaultRowHeight: 16,
  defaultColumnWidth: 100,
  fixRows: 0,
  fixColumns: 0
};
export var TableHeader = function TableHeader(props) {
  return React.createElement("thead", props);
}; // Extract it as generic resize component

var useResize = function useResize(index, _ref3) {
  var defaultSize = _ref3.defaultSize,
      size = _ref3.size,
      coordinate = _ref3.coordinate;

  var _useContext = useContext(TableContext),
      defSize = _useContext[defaultSize],
      _useContext$size = _slicedToArray(_useContext[size], 2),
      sizes = _useContext$size[0],
      setSizes = _useContext$size[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      interaction = _useState6[0],
      setInteraction = _useState6[1];

  var handleMouseDown = function handleMouseDown(event) {
    var startCoordinate = event[coordinate];
    var startSize = sizes[index] || defSize;
    setInteraction({
      index: index,
      startCoordinate: startCoordinate,
      startSize: startSize
    });
  };

  useEffect(function () {
    var handleMouseMove = function handleMouseMove(event) {
      if (interaction) {
        setSizes(function (sizes) {
          var nextSizes = _toConsumableArray(sizes);

          var diff = event[coordinate] - interaction.startCoordinate;
          nextSizes[index] = interaction.startSize + diff;
          return nextSizes;
        });
      }
    };

    var handleMouseUp = function handleMouseUp() {
      if (interaction) setInteraction(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return function () {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [index, coordinate, interaction, setSizes]);
  return handleMouseDown;
};

export var TableColumnResizer = function TableColumnResizer(_ref4) {
  var index = _ref4.index,
      props = _objectWithoutProperties(_ref4, ["index"]);

  var handleMouseDown = useResize(index, {
    defaultSize: 'defaultColumnWidth',
    size: 'widths',
    coordinate: 'pageX'
  });
  return React.createElement("div", Object.assign({}, props, {
    onMouseDown: handleMouseDown
  }));
};
var TableRowContext = createContext();
export var TableRow = function TableRow(_ref5) {
  var index = _ref5.index,
      props = _objectWithoutProperties(_ref5, ["index"]);

  return React.createElement(TableRowContext.Provider, {
    value: index
  }, React.createElement("tr", props));
};
export var TableRowResizer = function TableRowResizer(props) {
  var index = useContext(TableRowContext);
  var handleMouseDown = useResize(index, {
    defaultSize: 'defaultRowHeight',
    size: 'heights',
    coordinate: 'pageY'
  });
  return React.createElement("div", Object.assign({}, props, {
    onMouseDown: handleMouseDown
  }));
};

var isFixed = function isFixed(index, fixCells) {
  return index <= fixCells - 1;
};

var getFixedStyle = function getFixedStyle(_ref6) {
  var index = _ref6.index,
      fixCells = _ref6.fixCells,
      sizes = _ref6.sizes,
      defaultSize = _ref6.defaultSize,
      offsetProperty = _ref6.offsetProperty;
  var style = {};

  if (isFixed(index, fixCells)) {
    style.position = 'sticky';
    var offset = 0;

    for (var i = 0; i < index && i < fixCells; i++) {
      var currentSize = sizes[i] || defaultSize;
      offset = offset + currentSize;
    }

    style[offsetProperty] = offset;
  }

  return style;
};

var getFixedClassName = function getFixedClassName(_ref7) {
  var _classNames;

  var index = _ref7.index,
      fixCells = _ref7.fixCells,
      className = _ref7.className,
      fixClass = _ref7.fixClass,
      lastFixClass = _ref7.lastFixClass;
  var cellIsFixed = isFixed(index, fixCells);
  return classNames((_classNames = {}, _defineProperty(_classNames, fixClass, cellIsFixed), _defineProperty(_classNames, lastFixClass, lastFixClass && cellIsFixed && index === fixCells - 1), _classNames), className);
};

export var TableCell = function TableCell(_ref8) {
  var _ref8$Component = _ref8.Component,
      Component = _ref8$Component === void 0 ? 'td' : _ref8$Component,
      columnIndex = _ref8.columnIndex,
      className = _ref8.className,
      style = _ref8.style,
      props = _objectWithoutProperties(_ref8, ["Component", "columnIndex", "className", "style"]);

  var _useContext2 = useContext(TableContext),
      defaultColumnWidth = _useContext2.defaultColumnWidth,
      defaultRowHeight = _useContext2.defaultRowHeight,
      _useContext2$widths = _slicedToArray(_useContext2.widths, 1),
      widths = _useContext2$widths[0],
      _useContext2$heights = _slicedToArray(_useContext2.heights, 1),
      heights = _useContext2$heights[0],
      fixColumns = _useContext2.fixColumns,
      fixRows = _useContext2.fixRows,
      classes = _useContext2.classes; // TODO: introduce 'fixed' prop and fix the cell depending not only on fixed cells count, but also on this prop


  var rowIndex = useContext(TableRowContext);
  var columnFixedStyle = getFixedStyle({
    index: columnIndex,
    fixCells: fixColumns,
    sizes: widths,
    defaultSize: defaultColumnWidth,
    offsetProperty: 'left'
  });
  var rowFixedStyle = getFixedStyle({
    index: rowIndex,
    fixCells: fixRows,
    sizes: heights,
    defaultSize: defaultRowHeight,
    offsetProperty: 'top'
  });
  var columnClassName = getFixedClassName({
    className: className,
    index: columnIndex,
    fixClass: classes.fixColumn,
    lastFixClass: classes.lastFixColumn,
    fixCells: fixColumns
  });
  var rowClassName = getFixedClassName({
    className: className,
    index: rowIndex,
    fixClass: classes.fixRow,
    lastFixClass: classes.lastFixRow,
    fixCells: fixRows
  });

  var nextStyle = _objectSpread({}, style, {}, columnFixedStyle, {}, rowFixedStyle);

  return React.createElement(Component, Object.assign({}, props, {
    className: classNames(columnClassName, rowClassName),
    style: nextStyle
  }));
};
export var TableHeaderCell = function TableHeaderCell(_ref9) {
  var _ref9$style = _ref9.style,
      style = _ref9$style === void 0 ? {} : _ref9$style,
      props = _objectWithoutProperties(_ref9, ["style"]);

  var _useContext3 = useContext(TableContext),
      defaultColumnWidth = _useContext3.defaultColumnWidth,
      _useContext3$widths = _slicedToArray(_useContext3.widths, 1),
      widths = _useContext3$widths[0];

  var width = widths[props.columnIndex] || defaultColumnWidth;

  var nextStyle = _objectSpread({}, style, {
    width: width
  });

  return React.createElement(TableCell, Object.assign({
    Component: "th"
  }, props, {
    style: nextStyle
  }));
};
export var TableCellValue = function TableCellValue(_ref10) {
  var mode = _ref10.mode,
      style = _ref10.style,
      props = _objectWithoutProperties(_ref10, ["mode", "style"]);

  var _useContext4 = useContext(TableContext),
      defaultRowHeight = _useContext4.defaultRowHeight,
      _useContext4$heights = _slicedToArray(_useContext4.heights, 1),
      heights = _useContext4$heights[0];

  var index = useContext(TableRowContext);
  var height = heights[index] || defaultRowHeight;

  var nextStyle = _objectSpread({}, style, {
    height: height,
    overflow: 'hidden'
  });

  return React.createElement("div", Object.assign({
    style: nextStyle
  }, props));
};
export var TableBody = function TableBody(props) {
  return React.createElement("tbody", props);
};