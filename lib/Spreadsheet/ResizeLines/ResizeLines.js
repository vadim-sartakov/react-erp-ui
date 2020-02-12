import React from 'react';
import ResizeLinesView from './ResizeLinesView';
import { getCellsRangeSize } from '../../utils/gridUtils';

var ResizeLines = function ResizeLines(_ref) {
  var _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? ResizeLinesView : _ref$Component,
      type = _ref.type,
      meta = _ref.meta,
      fixCount = _ref.fixCount,
      index = _ref.index,
      visibleIndexes = _ref.visibleIndexes,
      defaultSize = _ref.defaultSize;
  var containerStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    width: '100%',
    height: '100%'
  };
  var startIndex = visibleIndexes[0];
  var size = getCellsRangeSize({
    startIndex: startIndex,
    count: index + 1 - startIndex,
    defaultSize: defaultSize,
    meta: meta
  });

  if (type === 'column') {
    var width = size;
    var style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      width: width,
      height: '100%',
      top: 0,
      left: 0
    };
    return React.createElement("div", {
      style: containerStyle
    }, React.createElement(Component, {
      type: type,
      style: style
    }));
  } else if (type === 'row') {
    var height = size;
    var _style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      height: height,
      width: '100%',
      top: 0,
      left: 0
    };
    return React.createElement("div", {
      style: containerStyle
    }, React.createElement(Component, {
      type: type,
      style: _style
    }));
  }
};

export default ResizeLines;