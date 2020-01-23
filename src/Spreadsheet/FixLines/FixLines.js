import React from 'react';
import classes from './FixLines.module.css';

const FixLines = ({ type, style }) => {
  const className = type === 'rows' ? classes.fixedRows : classes.fixedColumns
  return <div className={className} style={style} />;
};

export default FixLines;