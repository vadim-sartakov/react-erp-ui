import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";
import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';

var SelectedRange = function SelectedRange(_ref) {
  var multiple = _ref.multiple,
      props = _objectWithoutProperties(_ref, ["multiple"]);

  var rootStyle = {
    transition: '100ms ease-in-out'
  };
  return React.createElement(SpreadsheetCell, Object.assign({
    className: classNames('selected-range', {
      'selected-range-multiple': multiple
    }),
    rootStyle: rootStyle,
    noPointerEvents: true
  }, props));
};

export default SelectedRange;