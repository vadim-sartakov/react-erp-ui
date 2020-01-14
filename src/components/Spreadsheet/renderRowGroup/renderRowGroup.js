import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './renderRowGroup.module.css';

const renderRowGroup = ({ mergedRange, row, column, rows, columns, rowIndex, defaultRowHeight, groupSize, backgroundColor }) => {
  const height = (rows[rowIndex - 1] && rows[rowIndex  - 1].size) || defaultRowHeight;
  return (
    <SpreadsheetCell
        row={row}
        column={column}
        rows={rows}
        columns={columns}
        mergedRange={mergedRange}
        style={{ backgroundColor }}>
      <div className={classes.buttonContainer} style={{ height }}>
        <div className={classes.groupButton} style={{ backgroundColor }}>-</div>
      </div>
      <div
          className={classes.groupLine}
          style={{
            height: `calc(100% - ${height / 2}px)`,
            width: groupSize / 2,
            top: height / 2
          }} />
    </SpreadsheetCell>
  )
};

export default renderRowGroup;