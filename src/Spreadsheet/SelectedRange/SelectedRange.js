import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './SelectedRange.module.css';

const SelectedRange = ({ multiple, ...props }) => {
  const rootStyle = { transition: '100ms ease-in-out' };
  return <SpreadsheetCell className={classNames(classes.root, { [classes.multiple]: multiple })} rootStyle={rootStyle} noPointerEvents {...props} />;
};

export default SelectedRange;