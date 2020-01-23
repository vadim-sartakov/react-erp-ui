import React from 'react';
import classes from './FixLinesView.module.css';

const FixLinesView = ({ type, style }) => {
  const className = type === 'rows' ? classes.fixedRows : classes.fixedColumns
  return <div className={className} style={style} />;
};

export default FixLinesView;