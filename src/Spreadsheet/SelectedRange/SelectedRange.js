import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './SelectedRange.module.css';

const SelectedRange = props => {
  const rootStyle = { transition: '100ms ease-in-out' };
  return <SpreadsheetCell className={classes.root} rootStyle={rootStyle} noPointerEvents {...props} />;
};

export default SelectedRange;