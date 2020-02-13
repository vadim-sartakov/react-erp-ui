import React from 'react';
import classNames from 'classnames';
import SpreadsheetCell from '../SpreadsheetCell';

const SelectedRange = ({ multiple, ...props }) => {
  const rootStyle = { transition: '100ms ease-in-out' };
  return <SpreadsheetCell className={classNames('selected-range', { 'selected-range-multiple': multiple })} rootStyle={rootStyle} noPointerEvents {...props} />;
};

export default SelectedRange;