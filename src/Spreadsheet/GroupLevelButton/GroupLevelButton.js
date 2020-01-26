import React from 'react';
import classes from './GroupLevelButton.module.css';

const GroupLevelButton = ({ index, onClick }) => {
  return (
    <div className={classes.groupButtonContainer}>
      <div className={classes.groupButton} onClick={onClick}>
        {index + 1}
      </div>
    </div>
  )
};

export default GroupLevelButton;