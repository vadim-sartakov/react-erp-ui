import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";
import React, { useCallback } from 'react';
import HeadingView from './HeadingView';
import { normalizeMergedRange } from '../../MergedCell';
var Heading = React.memo(function (_ref) {
  var _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? HeadingView : _ref$Component,
      onResizeInteractionChange = _ref.onResizeInteractionChange,
      props = _objectWithoutProperties(_ref, ["Component", "onResizeInteractionChange"]);

  var selected = props.selectedCells.some(function (selectedRange) {
    var normalizedSelectedRange = normalizeMergedRange(selectedRange);
    return props.index >= normalizedSelectedRange.start[props.type] && props.index <= normalizedSelectedRange.end[props.type];
  });
  var onMouseDown = useCallback(function () {
    return onResizeInteractionChange({
      index: props.index,
      type: props.type
    });
  }, [onResizeInteractionChange, props.index, props.type]);
  var onMouseUp = useCallback(function () {
    return onResizeInteractionChange(undefined);
  }, [onResizeInteractionChange]);
  return React.createElement(Component, Object.assign({}, props, {
    selected: selected,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  }));
});
export default Heading;