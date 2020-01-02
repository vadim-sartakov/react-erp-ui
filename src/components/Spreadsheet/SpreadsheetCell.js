import React from 'react';
import ScrollerCell from '../Scroller/ScrollerCell';

/**
 * @param {import('./').SpreadsheetCellProps} props 
 */
const SpreadsheetCell = ({
  ...props
}) => {
  return <ScrollerCell {...props} />;
};

export default SpreadsheetCell;