import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useCallback } from 'react';
import useResize from '../useResize';

var setMeta = function setMeta(_ref) {
  var index = _ref.index,
      resizeProperty = _ref.resizeProperty,
      minSize = _ref.minSize,
      onChange = _ref.onChange,
      beforeCallback = _ref.beforeCallback;
  return function (newSize) {
    beforeCallback && beforeCallback();
    var curSize = Math.max(newSize[resizeProperty], minSize);
    onChange(function (sizes) {
      var nextSizes = _toConsumableArray(sizes || []);

      nextSizes[index] = _objectSpread({}, nextSizes[index], {
        size: curSize
      });
      return nextSizes;
    });
  };
};

var GridResizer = function GridResizer(_ref2) {
  var _sizes;

  var type = _ref2.type,
      index = _ref2.index,
      defaultSize = _ref2.defaultSize,
      meta = _ref2.meta,
      onChange = _ref2.onChange,
      resizeMeta = _ref2.resizeMeta,
      onMouseDown = _ref2.onMouseDown,
      onMouseUp = _ref2.onMouseUp,
      onResize = _ref2.onResize,
      _ref2$Component = _ref2.Component,
      Component = _ref2$Component === void 0 ? 'div' : _ref2$Component,
      _ref2$minSize = _ref2.minSize,
      minSize = _ref2$minSize === void 0 ? 10 : _ref2$minSize,
      props = _objectWithoutProperties(_ref2, ["type", "index", "defaultSize", "meta", "onChange", "resizeMeta", "onMouseDown", "onMouseUp", "onResize", "Component", "minSize"]);

  var resizeProperty, otherResizeProperty;

  if (type === 'row') {
    resizeProperty = 'height';
    otherResizeProperty = 'width';
  } else {
    resizeProperty = 'width';
    otherResizeProperty = 'height';
  }

  var sizes = (_sizes = {}, _defineProperty(_sizes, resizeProperty, meta && meta.size || defaultSize), _defineProperty(_sizes, otherResizeProperty, 0), _sizes);
  var handleMouseMove = useCallback(setMeta({
    index: index,
    resizeProperty: resizeProperty,
    minSize: minSize,
    onChange: onResize
  }), [index, onChange, resizeProperty, minSize]);
  var handleMouseUp = useCallback(setMeta({
    index: index,
    resizeProperty: resizeProperty,
    minSize: minSize,
    onChange: onChange,
    beforeCallback: onMouseUp
  }), [index, onChange, resizeProperty, minSize]);
  var onStartResize = useResize({
    sizes: sizes,
    onMouseDown: onMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp
  });
  return React.createElement(Component, Object.assign({}, props, {
    onMouseDown: onStartResize
  }));
};

export default GridResizer;