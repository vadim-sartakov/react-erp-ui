import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './Heading.module.css';

const HeadingsIntersection = ({ row, column }) => {
  return <SpreadsheetCell className={classes.cell} row={row} column={column} />
};

export default HeadingsIntersection;