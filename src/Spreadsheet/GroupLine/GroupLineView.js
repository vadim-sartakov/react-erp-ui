import React from 'react';
import classes from './GroupLine.module.css';

const GroupLineView = ({
  type,
  backgroundColor,
  containerStyle,
  lineStyle,
  collapsed,
  onClick
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
    <div className={classes.root}>
      <div className={classes.buttonContainer} style={{ ...containerStyle, backgroundColor }}>
        <div className={classes.groupButton} style={{ backgroundColor }} onClick={onClick}>
          {collapsed ? '+' : '-'}
        </div>
      </div>
      {!collapsed && <div className={lineClassName} style={lineStyle} />}
    </div>
  )
};

export default GroupLineView;