import { useRef, useCallback } from 'react';
import { expandSelection } from './utils';
import { getOverscrolledCellOffset } from '../Scroller/utils';

export const moveSelection = ({
  selectedCells,
  append,
  rowOffset = 0,
  columnOffset = 0,
  specialRowsCount = 0,
  specialColumnsCount = 0,
  mergedCells,
  totalRows,
  totalColumns
}) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  let nextSelection;

  const rowEdge = rowOffset > 0 ? Math.max(lastSelection.end.row, lastSelection.start.row, lastSelection.end.row) : Math.min(lastSelection.end.row, lastSelection.start.row, lastSelection.end.row);
  const columnEdge = columnOffset > 0 ? Math.max(lastSelection.end.column, lastSelection.start.column, lastSelection.end.column) : Math.min(lastSelection.end.column, lastSelection.start.column, lastSelection.end.column);

  let endRow = rowEdge + rowOffset;
  let endColumn = columnEdge + columnOffset;

  // Preventing moving out of value area
  if (totalRows) endRow = rowOffset > 0 ? Math.min(endRow, totalRows - 1) : Math.max(endRow, specialRowsCount);
  if (totalColumns) endColumn = columnOffset > 0 ? Math.min(endColumn, totalColumns - 1) : Math.max(endColumn, specialColumnsCount);

  if (lastSelection) {
    nextSelection = {};
    if (append) {
      nextSelection.start = {
        row: lastSelection.start.row,
        column: lastSelection.start.column
      };
    } else {
      nextSelection.start = { row: endRow, column: endColumn };
    }
    nextSelection = expandSelection({
      selection: nextSelection,
      mergedCells,
      rowIndex: endRow,
      columnIndex: endColumn,
      east: rowOffset > 0,
      south: columnOffset > 0
    });
  } else {
    nextSelection = {
      start: { row: specialRowsCount, column: specialColumnsCount },
      end: { row: specialRowsCount, column: specialColumnsCount }
    }
  }
  return [nextSelection];
};

const moveScrollPosition = ({
  selectedCells,
  rows,
  columns,
  fixColumns,
  fixRows,
  defaultRowHeight,
  defaultColumnWidth, 
  scrollerContainerRect,
  scrollerContainerRef
}) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  const rect = scrollerContainerRect;
  const { overscrollLeft, overscrollTop } = getOverscrolledCellOffset({
    rows,
    columns,
    defaultRowHeight,
    defaultColumnWidth,
    rowIndex: lastSelection.end.row,
    columnIndex: lastSelection.end.column,
    fixRows,
    fixColumns,
    scrollTop: scrollerContainerRef.current.scrollTop,
    scrollLeft: scrollerContainerRef.current.scrollLeft,
    containerWidth: rect.width,
    containerHeight: rect.height
  });
  if (overscrollLeft) scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
  if (overscrollTop) scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
};

const useKeyboard = ({
  rows,
  columns,
  specialRowsCount,
  specialColumnsCount,
  fixRows,
  fixColumns,
  mergedCells,
  totalRows,
  totalColumns,
  rowsPerPage,
  defaultRowHeight,
  defaultColumnWidth,
  onSelectedCellsChange,
  scrollerContainerRef
}) => {

  const handlingKeyDown = useRef(false);

  const onKeyDown = useCallback(event => {
    event.persist();
    event.preventDefault();

    if (handlingKeyDown.current) return;
    
    const setSelectedCells = (append, rowOffset, columnOffset) => selectedCells => {
      const nextSelection = moveSelection({
        selectedCells,
        append,
        rowOffset,
        columnOffset,
        specialRowsCount,
        specialColumnsCount,
        mergedCells,
        totalRows,
        totalColumns
      });
      moveScrollPosition({
        selectedCells: nextSelection,
        rowOffset,
        columnOffset,
        rows,
        columns,
        fixColumns,
        fixRows,
        defaultRowHeight,
        defaultColumnWidth,
        scrollerContainerRef,
        scrollerContainerRect: scrollerContainerRef.current.getBoundingClientRect()
      });
      return nextSelection;
    };

    switch (event.key) {
      case 'ArrowDown':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, 1, 0));
        break;
      case 'ArrowUp':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, -1, 0));
        break;
      case 'ArrowLeft':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, 0, -1));
        break;
      case 'ArrowRight':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, 0, 1));
        break;
      case 'PageDown':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, Math.ceil(rowsPerPage / 2, 0), 0));
        break;
      case 'PageUp':
        onSelectedCellsChange(setSelectedCells(event.shiftKey, -Math.floor(rowsPerPage / 2, 0), 0));
        break;
      case 'Home':
        if (event.ctrlKey) onSelectedCellsChange(setSelectedCells(event.shiftKey, -totalRows, 0));
        break
      case 'End':
        if (event.ctrlKey) onSelectedCellsChange(setSelectedCells(event.shiftKey, totalRows, 0));
        break
      default:
    };

    handlingKeyDown.current = true;
    setTimeout(() => handlingKeyDown.current = false, 50);
  }, [
    mergedCells,
    onSelectedCellsChange,
    specialRowsCount,
    specialColumnsCount,
    defaultRowHeight,
    defaultColumnWidth,
    rows,
    columns,
    fixRows,
    fixColumns,
    rowsPerPage,
    totalRows,
    totalColumns,
    scrollerContainerRef
  ]);

  return onKeyDown;

};

export default useKeyboard;