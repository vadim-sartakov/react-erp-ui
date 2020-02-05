import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';
import GridResizer from '../../GridResizer';
import classes from './Heading.module.css';

const Heading = ({
  row,
  column,
  defaultSize,
  onChange,
  type,
  meta,
  index
}) => {
  let className, resizerClassName;
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
      className = classes.cell
  }
  return (
    <SpreadsheetCell className={className} row={row} column={column}>
      {meta.key + 1}
      <GridResizer type={type} meta={meta} defaultSize={defaultSize} onChange={onChange} index={index} className={resizerClassName} />
    </SpreadsheetCell>
  )
};

export default Heading;