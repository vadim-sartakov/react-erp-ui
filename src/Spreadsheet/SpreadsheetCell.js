import React from 'react';
import MergedCell from '../MergedCell';
import { ScrollerCell } from '../Scroller';

const SpreadsheetCell = props => {
  if (props.mergedRange) {
    return <MergedCell {...props} />;
  } else {
    return <ScrollerCell {...props} />;
  };
};

export default SpreadsheetCell;