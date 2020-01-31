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
  row,
  column,
  value,
  Component
}) => {
  const rowStyle = (row && row.style) || {};
  const columnStyle = (column && column.style) || {};
  const valueStyle = (value && value.style) || {};

  const resultStyle = {
    ...columnStyle,
    ...rowStyle,
    ...valueStyle
  };

  const componentStyle = {
    display: 'flex'
  };
  componentStyle.alignItems = (resultStyle.verticalAlign && flexAlignValuesMap[resultStyle.verticalAlign]) || 'flex-end';
  componentStyle.justifyContent = flexAlignValuesMap[resultStyle.horizontalAlign];
  componentStyle.backgroundColor = resultStyle.fill;
  if (resultStyle.font) {
    componentStyle.color = resultStyle.font.color;
    componentStyle.fontFamily = resultStyle.font.name;
    componentStyle.size = resultStyle.font.size;
    componentStyle.fontWeight = resultStyle.font.bold ? 'bold' : undefined;
    componentStyle.fontStyle = resultStyle.font.italic ? 'italic' : undefined;
  }

  return <Component style={componentStyle} value={value} />
};

export default Cell;