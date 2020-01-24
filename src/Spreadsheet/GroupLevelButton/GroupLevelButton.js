import React from 'react';
import { SpreadsheetCell } from '../';
import classes from './GroupLevelButton.module.css';

const GroupLevelButton = ({ row, column, index, onClick }) => {
  return (
    <SpreadsheetCell row={row} column={column} style={{ zIndex: 8 }}>
      <div className={classes.groupButtonContainer}>
        <div className={classes.groupButton} onClick={onClick}>
          {index + 1}
        </div>
      </div>
    </SpreadsheetCell>
  )
};

export default GroupLevelButton;