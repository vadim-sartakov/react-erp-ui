import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';

const HeadingsIntersection = ({ row, column }) => {
  return <SpreadsheetCell className="heading-cell" row={row} column={column} />
};

export default HeadingsIntersection;