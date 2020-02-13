import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell'

const GroupLevelButton = ({ index, row, column, onClick }) => {
  return (
    <SpreadsheetCell row={row} column={column} className="group-button-container" style={{ zIndex: 8 }}>
      <div className="group-button" onClick={onClick}>
        {index + 1}
      </div>
    </SpreadsheetCell>
  )
};

export default GroupLevelButton;