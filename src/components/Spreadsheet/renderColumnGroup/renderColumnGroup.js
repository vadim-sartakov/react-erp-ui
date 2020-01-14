import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './renderColumnGroup.module.css';

const renderColumnGroup = ({ mergedRange, row, column, rows, columns, columnIndex, defaultColumnWidth, groupSize, backgroundColor }) => {
  const width = (columns[columnIndex - 1] && columns[columnIndex - 1].size) || defaultColumnWidth;
  return (
    <SpreadsheetCell
        row={row}
        column={column}
        rows={rows}
        columns={columns}
        mergedRange={mergedRange}
        style={{ backgroundColor }}>
      <div className={classes.buttonContainer} style={{ width }}>
        <div className={classes.groupButton} style={{ backgroundColor }}>-</div>
      </div>
      <div
          className={classes.groupLine}
          style={{
            width: `calc(100% - ${width / 2}px)`,
            left: width / 2,
            height: groupSize / 2
          }} />
    </SpreadsheetCell>
  )
};

export default renderColumnGroup;