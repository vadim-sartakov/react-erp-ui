import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './SpecialCellEmptyArea.module.css';

const SpecialCellEmptyArea = props => <SpreadsheetCell className={classes.root} {...props} />;

export default SpecialCellEmptyArea;