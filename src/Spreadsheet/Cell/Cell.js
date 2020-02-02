import React, { useCallback } from 'react';
import { normalizeMergedRange } from '../../MergedCell';
import intersectRect from '../../utils/intersectRect';

const flexAlignValuesMap = {
  top: 'flex-start',
  left: 'flex-start',
  middle: 'center',
  center: 'center',
  bottom: 'flex-end',
  right: 'flex-end'
};

function convertRangeToRect(mergedRange) {
  return {
    top: mergedRange.start.row,
    left: mergedRange.start.column,
    bottom: mergedRange.end.row,
    right: mergedRange.end.column
  }
}

function rangesIntersect(rangeA, rangeB) {
  const normalizedA = normalizeMergedRange(rangeA);
  const normalizedB = normalizeMergedRange(rangeB);
  return intersectRect(convertRangeToRect(normalizedA), convertRangeToRect(normalizedB));
};

function rangesAreEqual(rangeA, rangeB) {
  return rangeA.start.row === rangeB.start.row &&
      rangeA.start.column === rangeB.start.column &&
      rangeA.end.row === rangeB.end.row &&
      rangeA.start.column === rangeB.end.column
};

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
      const curRange = {
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
  }, [onSelectedCellsChange, rowIndex, columnIndex]);

  const onMouseMove = useCallback(event => {
    if (mousePressed.current) {
      onSelectedCellsChange(selectedCells => {
        const lastSelection = selectedCells[selectedCells.length - 1];

        const nextLastSelection = {
          start: { row: lastSelection.start.row, column: lastSelection.start.column },
          end: { row: rowIndex, column: columnIndex }
        };
        
        mergedCells.forEach(mergedRange => {
          if (rangesIntersect(nextLastSelection, mergedRange)) {
            const normalizedMergedRange = normalizeMergedRange(mergedRange);
            const normalizedNextSelection = normalizeMergedRange(nextLastSelection);
            nextLastSelection.start.row = Math.min(normalizedMergedRange.start.row, normalizedNextSelection.start.row);
            nextLastSelection.start.column = Math.min(normalizedMergedRange.start.column, normalizedNextSelection.start.column);
            nextLastSelection.end.row = Math.max(normalizedMergedRange.end.row, normalizedNextSelection.end.row);
            nextLastSelection.end.column = Math.max(normalizedMergedRange.end.column, normalizedNextSelection.end.column);
          }
        });

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