import React, { useCallback } from 'react';
import { expandSelection } from '../utils';

const flexAlignValuesMap = {
  top: 'flex-start',
  left: 'flex-start',
  middle: 'center',
  center: 'center',
  bottom: 'flex-end',
  right: 'flex-end'
};

function rangesAreEqual(rangeA, rangeB) {
  return rangeA.start.row === rangeB.start.row &&
      rangeA.start.column === rangeB.start.column &&
      rangeA.end.row === rangeB.end.row &&
      rangeA.end.column === rangeB.end.column
};

const mergedRangeFind = (rowIndex, columnIndex) => mergedRange => mergedRange.start.row === rowIndex && mergedRange.start.column === columnIndex;

const Cell = ({
  mergedCells,
  row,
  column,
  rowIndex,
  columnIndex,
  cell,
  Component,
  onSelectedCellsChange,
  mousePressed
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
  if (!resultStyle.wrapText) componentStyle.whiteSpace = 'nowrap';
  if (resultStyle.fill) componentStyle.backgroundColor = resultStyle.fill;
  if (resultStyle.font) {
    if (resultStyle.font.color) componentStyle.color = resultStyle.font.color;
    if (resultStyle.font.name) componentStyle.fontFamily = resultStyle.font.name;
    if (resultStyle.font.size) componentStyle.fontSize = resultStyle.font.size;
    if (resultStyle.font.bold) componentStyle.fontWeight = 'bold';
    if (resultStyle.font.italic) componentStyle.fontStyle = 'italic';
  }

  const onMouseDown = useCallback(event => {
    event.persist();
    onSelectedCellsChange(selectedCells => {
      const mergedRange = mergedCells.find(mergedRangeFind(rowIndex, columnIndex));
      const curRange = mergedRange || {
        start: { row: rowIndex, column: columnIndex },
        end: { row: rowIndex, column: columnIndex }
      };
      /*if (event.ctrlKey) {
        if (selectedCells.some(selectedRange => selectedRange.row === rowIndex && selectedRange.column === columnIndex)) return selectedCells;
        return [...selectedCells, curRange]
      } else {*/
        return [curRange];
      //}
    });
  }, [onSelectedCellsChange, rowIndex, columnIndex, mergedCells]);

  const onMouseMove = useCallback(event => {
    if (mousePressed.current) {
      onSelectedCellsChange(selectedCells => {
        const lastSelection = selectedCells[selectedCells.length - 1];
        const nextLastSelection = expandSelection({ selection: lastSelection, mergedCells, rowIndex, columnIndex })
        // Preventing excessive updates
        if (rangesAreEqual(lastSelection, nextLastSelection)) return selectedCells;
        const nextSelectedCells = [...selectedCells];
        nextSelectedCells[nextSelectedCells.length - 1] = nextLastSelection;
        return nextSelectedCells;
      });
    }
  }, [rowIndex, columnIndex, mousePressed, onSelectedCellsChange, mergedCells]);

  return (
    <Component
        style={componentStyle}
        cell={cell}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove} />
  )
};

export default Cell;