import React from 'react';
import classes from './ResizeLines.module.css';

const ResizeLinesView = ({ type, style }) => {
  const className = type === 'row' ? classes.row : classes.column;
  return <div className={className} style={style} />;
};

export default ResizeLinesView;