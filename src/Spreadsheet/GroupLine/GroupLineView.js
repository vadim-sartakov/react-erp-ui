import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';
import classes from './GroupLine.module.css';

const GroupLineView = ({
  type,
  backgroundColor,
  containerStyle,
  lineStyle,
  collapsed,
  onButtonClick,
  ...props
}) => {
  let lineClassName;
  switch (type) {
    case 'row':
      lineClassName = classes.verticalLine;
      break;
    case 'column':
      lineClassName = classes.horizontalLine;
      break;
    default:
  }
  return (
    <SpreadsheetCell className={classes.root} {...props}>
      <div className={classes.buttonContainer} style={{ ...containerStyle, backgroundColor }}>
        <div className={classes.groupButton} style={{ backgroundColor }} onClick={onButtonClick}>
          {collapsed ? '+' : '-'}
        </div>
      </div>
      {!collapsed && <div className={lineClassName} style={lineStyle} />}
    </SpreadsheetCell>
  )
};

export default GroupLineView;