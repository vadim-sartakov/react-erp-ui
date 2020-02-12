import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';
import GridResizer from '../../GridResizer';
import classes from './Heading.module.css';

var HeadingView = function HeadingView(_ref) {
  var selected = _ref.selected,
      row = _ref.row,
      column = _ref.column,
      defaultSize = _ref.defaultSize,
      onChange = _ref.onChange,
      onMouseDown = _ref.onMouseDown,
      onMouseUp = _ref.onMouseUp,
      onResize = _ref.onResize,
      type = _ref.type,
      meta = _ref.meta,
      index = _ref.index;
  var className, resizerClassName;

  switch (type) {
    case 'column':
      className = classNames(classes.cell, classes.columnNumber);
      resizerClassName = classNames(classes.resizer, classes.columnResizer);
      break;

    case 'row':
      className = classNames(classes.cell, classes.rowNumber);
      resizerClassName = classNames(classes.resizer, classes.rowResizer);
      break;

    default:
      className = classes.cell;
  }

  return React.createElement(SpreadsheetCell, {
    className: classNames(className, _defineProperty({}, classes.selected, selected)),
    row: row,
    column: column
  }, meta.key + 1, React.createElement(GridResizer, {
    type: type,
    meta: meta,
    defaultSize: defaultSize,
    onChange: onChange,
    onMouseUp: onMouseUp,
    onMouseDown: onMouseDown,
    onResize: onResize,
    index: index,
    className: resizerClassName
  }));
};

export default HeadingView;