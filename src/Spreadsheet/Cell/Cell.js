import React from 'react';

const flexAlignValuesMap = {
  top: 'flex-start',
  left: 'flex-start',
  middle: 'center',
  center: 'center',
  bottom: 'flex-end',
  right: 'flex-end'
};

const Cell = ({
  value,
  Component
}) => {
  const style = {
    display: 'flex'
  };
  const valueStyle = value.style;
  style.alignItems = (valueStyle && valueStyle.verticalAlign && flexAlignValuesMap[valueStyle.verticalAlign]) || 'flex-end';
  if (valueStyle && valueStyle.horizontalAlign) style.justifyContent = flexAlignValuesMap[valueStyle.horizontalAlign];

  return <Component style={style} value={value} />
};

export default Cell;