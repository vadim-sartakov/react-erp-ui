import React from 'react';
import classNames from 'classnames';
import { SpreadsheetCell, SpreadsheetResizer } from '../';
import classes from './RowColumnNumber.module.css';

const RowColumnNumber = ({
  type,
  row,
  column,
  index
}) => {
  let key, className, resizerClassName;
  switch (type) {
    case 'column':
      key = column.key;
      className = classNames(classes.cell, classes.columnNumber);
      resizerClassName = classNames(classes.resizer, classes.columnResizer);
      break;
    case 'row':
      key = row.key;
      className = classNames(classes.cell, classes.rowNumber);
      resizerClassName = classNames(classes.resizer, classes.rowResizer);
      break;
    // Intersection
    default:
      className = classes.cell
  }
  return (
    <SpreadsheetCell
        row={row}
        column={column}
        className={className}>
      {(key !== undefined) && (
        <>
          {key + 1}
          <SpreadsheetResizer mode={type} row={row} column={column} index={index} className={resizerClassName} />
        </>
      )}
    </SpreadsheetCell>
  )
};

export default RowColumnNumber;