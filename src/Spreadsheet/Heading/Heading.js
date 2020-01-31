import React from 'react';
import classNames from 'classnames';
import GridResizer from '../../GridResizer';
import classes from './Heading.module.css';

const Heading = ({
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
    <div className={className}>
      <>
        {meta.key + 1}
        <GridResizer type={type} meta={meta} defaultSize={defaultSize} onChange={onChange} index={index} className={resizerClassName} />
      </>
    </div>
  )
};

export default Heading;