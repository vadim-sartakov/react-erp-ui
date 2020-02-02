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

        const mergedRange = mergedCells.find(mergedRangeFind(rowIndex, columnIndex));
        const normalizedMergedRange = mergedRange && normalizeMergedRange(mergedRange);
        const normalizedLastSelection = normalizeMergedRange(lastSelection);

        const nextLastSelection = mergedRange ? {
          start: {
            row: Math.min(normalizedLastSelection.start.row, normalizedMergedRange.start.row),
            column: Math.min(normalizedLastSelection.start.column, normalizedMergedRange.start.column)
          },
          end: {
            row: Math.max(normalizedLastSelection.end.row, normalizedMergedRange.end.row),
            column: Math.max(normalizedLastSelection.end.column, normalizedMergedRange.end.column)
          }
        } : {
          start: {
            row: lastSelection.start.row,
            column: lastSelection.start.column
          },
          end: {
            row: rowIndex,
            column: columnIndex
          }
        };

        // TODO: interate all merged ranges and extend selection
        mergedCells.forEach(mergedRange => {
          const normalizedNextLastSelection = normalizeMergedRange(nextLastSelection);
          if (rangesIntersect(mergedRange, normalizedNextLastSelection)) {
            nextLastSelection.start.row = Math.min(normalizedNextLastSelection.start.row, mergedRange.start.row);
            nextLastSelection.start.column = Math.min(normalizedNextLastSelection.start.column, mergedRange.start.column);
            nextLastSelection.end.row = Math.max(normalizedNextLastSelection.end.row, mergedRange.end.row);
            nextLastSelection.end.column = Math.max(normalizedNextLastSelection.end.column, mergedRange.end.column);
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