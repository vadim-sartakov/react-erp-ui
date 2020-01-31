import React, { useCallback } from 'react';

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
  rowIndex,
  columnIndex,
  cell,
  Component,
  onSelectedCellsChange
}) => {
  const rowStyle = (row && row.style) || {};
  const columnStyle = (column && column.style) || {};
  const valueStyle = (cell && cell.style) || {};

  const resultStyle = {
    ...columnStyle,
    ...rowStyle,
    ...valueStyle
  };

  const componentStyle = {
    display: 'flex'
  };
  componentStyle.alignItems = (resultStyle.verticalAlign && flexAlignValuesMap[resultStyle.verticalAlign]) || 'flex-end';
  if (resultStyle.horizontalAlign) componentStyle.justifyContent = flexAlignValuesMap[resultStyle.horizontalAlign];
  if (resultStyle.wrapText) componentStyle.whiteSpace = 'nowrap';
  if (resultStyle.fill) componentStyle.backgroundColor = resultStyle.fill;
  if (resultStyle.font) {
    if (resultStyle.font.color) componentStyle.color = resultStyle.font.color;
    if (resultStyle.font.name) componentStyle.fontFamily = resultStyle.font.name;
    if (resultStyle.font.size) componentStyle.fontSize = resultStyle.font.size;
    if (resultStyle.font.bold) componentStyle.fontWeight = 'bold';
    if (resultStyle.font.italic) componentStyle.fontStyle = 'italic';
  }

  const onMouseDown = useCallback(() => {
    onSelectedCellsChange(selectedCells => {
      if (selectedCells.some(selectedRange => selectedRange.row === rowIndex && selectedRange.column === columnIndex)) return selectedCells;
      return [
        { row: rowIndex, column: columnIndex }
      ]
    });
  }, [onSelectedCellsChange, rowIndex, columnIndex]);

  return <Component style={componentStyle} cell={cell} onMouseDown={onMouseDown} />
};

export default Cell;