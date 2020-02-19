import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';
import GridResizer from '../../grid/GridResizer';

const HeadingView = ({
  selected,
  row,
  column,
  defaultSize,
  onChange,
  onMouseDown,
  onMouseUp,
  onResize,
  type,
  meta,
  index
}) => {  
  let className, resizerClassName;
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
  return (
    <SpreadsheetCell className={classNames(className, { 'heading-selected': selected })} row={row} column={column}>
      {meta.key + 1}
      <GridResizer
          type={type}
          meta={meta}
          defaultSize={defaultSize}
          onChange={onChange}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onResize={onResize}
          index={index}
          className={resizerClassName} />
    </SpreadsheetCell>
  )
};

export default HeadingView;