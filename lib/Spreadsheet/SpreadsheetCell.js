import React from 'react';
import MergedCell from '../MergedCell';
import { ScrollerCell } from '../Scroller';

var SpreadsheetCell = function SpreadsheetCell(props) {
  if (props.mergedRange) {
    return React.createElement(MergedCell, props);
  } else {
    return React.createElement(ScrollerCell, props);
  }

  ;
};

export default SpreadsheetCell;