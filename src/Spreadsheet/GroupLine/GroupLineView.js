import React from 'react';
import SpreadsheetCell from '../SpreadsheetCell';

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
      lineClassName = 'group-line-vertical-line';
      break;
    case 'column':
      lineClassName = 'group-line-horizontal-line';
      break;
    default:
  }
  return (
    <SpreadsheetCell className="group-line-root" {...props}>
      <div className="group-line-button-container" style={{ ...containerStyle, backgroundColor }}>
        <div className="group-line-button" style={{ backgroundColor }} onClick={onButtonClick}>
          {collapsed ? '+' : '-'}
        </div>
      </div>
      {!collapsed && <div className={lineClassName} style={lineStyle} />}
    </SpreadsheetCell>
  )
};

export default GroupLineView;