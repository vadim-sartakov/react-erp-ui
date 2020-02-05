import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell'
import classes from './GroupLevelButton.module.css';

const GroupLevelButton = ({ index, row, column, onClick }) => {
  return (
    <SpreadsheetCell row={row} column={column} className={classes.groupButtonContainer} style={{ zIndex: 8 }}>
      <div className={classes.groupButton} onClick={onClick}>
        {index + 1}
      </div>
    </SpreadsheetCell>
  )
};

export default GroupLevelButton;