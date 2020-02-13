import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';
import GridResizer from '../../GridResizer';

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
      className = classNames('heading-cell', 'heading-column-number');
      resizerClassName = classNames('heading-resizer', 'heading-column-resizer');
      break;

    case 'row':
      className = classNames('heading-cell', 'heading-row-number');
      resizerClassName = classNames('heading-resizer', 'heading-row-resizer');
      break;

    default:
      className = 'heading-cell';
  }

  return React.createElement(SpreadsheetCell, {
    className: classNames(className, {
      'heading-selected': selected
    }),
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