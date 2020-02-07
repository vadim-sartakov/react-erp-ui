import { useRef, useCallback, useEffect } from 'react';
import { expandSelection, getOverscrolledOffset } from './utils';
import { getCellPosition } from '../utils/gridUtils';

const moveSelection = ({ selectedCells, append, rowOffset, columnOffset, specialRowsCount, specialColumnsCount, mergedCells, totalRows, totalColumns }) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  let nextSelection;

  let endRow = lastSelection.end.row + rowOffset;
  let endColumn = lastSelection.end.column + columnOffset;

  // Preventing moving out of value area
  endRow = rowOffset > 0 ? Math.min(endRow, totalRows - 1) : Math.max(endRow, specialRowsCount);
  endColumn = columnOffset > 0 ? Math.min(endColumn, totalColumns - 1) : Math.max(endColumn, specialColumnsCount);

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

const moveScrollPosition = ({ selectedCells, rowOffset, columnOffset, rows, columns, fixColumns, fixRows, defaultRowHeight, defaultColumnWidth, scrollerContainerRectRef, scrollerContainerRef }) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  let x = getCellPosition({ meta: columns, index: lastSelection.end.column, defaultSize: defaultColumnWidth });
  let y = getCellPosition({ meta: rows, index: lastSelection.end.row, defaultSize: defaultRowHeight });
  
  if (rowOffset > 0) y += (rows[lastSelection.end.row] && rows[lastSelection.end.row].size) || defaultRowHeight;
  if (columnOffset > 0) x += (columns[lastSelection.end.column] && columns[lastSelection.end.column].size) || defaultColumnWidth;

  const rect = scrollerContainerRectRef.current;

  x -= scrollerContainerRef.current.scrollLeft;
  y -= scrollerContainerRef.current.scrollTop;

  const overscrollLeft = getOverscrolledOffset({ coordinate: x, containerSize: rect.width, meta: columns, fixCount: fixColumns, defaultSize: defaultColumnWidth });
  const overscrollTop = getOverscrolledOffset({ coordinate: y, containerSize: rect.height, meta: rows, fixCount: fixRows, defaultSize: defaultRowHeight });

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

  const scrollerContainerRectRef = useRef();

  // Saving initial sizes to reuse it for performance
  useEffect(() => {
    const rect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  }, [scrollerContainerRef]);

  const handlingKeyDown = useRef(false);

  const onKeyDown = useCallback(event => {
    event.persist();
    event.preventDefault();

    if (handlingKeyDown.current) return;
    
    const setSelectedCells = (append, rowOffset, columnOffset) => selectedCells => {
      const nextSelection = moveSelection({ selectedCells, append, rowOffset, columnOffset, specialRowsCount, specialColumnsCount, mergedCells, totalRows: totalRows, totalColumns: totalColumns });
      moveScrollPosition({ selectedCells: nextSelection, rowOffset, columnOffset, rows, columns, fixColumns, fixRows, defaultRowHeight, defaultColumnWidth, scrollerContainerRef, scrollerContainerRectRef });
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
    scrollerContainerRef,
    scrollerContainerRectRef
  ]);

  return onKeyDown;

};

export default useKeyboard;