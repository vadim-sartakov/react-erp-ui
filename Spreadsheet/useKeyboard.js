import { useRef, useCallback } from 'react';
import { expandSelection } from './utils';
import { getOverscrolledCellOffset } from '../Scroller/utils';
export var moveSelection = function moveSelection(_ref) {
  var selectedCells = _ref.selectedCells,
      append = _ref.append,
      _ref$rowOffset = _ref.rowOffset,
      rowOffset = _ref$rowOffset === void 0 ? 0 : _ref$rowOffset,
      _ref$columnOffset = _ref.columnOffset,
      columnOffset = _ref$columnOffset === void 0 ? 0 : _ref$columnOffset,
      _ref$specialRowsCount = _ref.specialRowsCount,
      specialRowsCount = _ref$specialRowsCount === void 0 ? 0 : _ref$specialRowsCount,
      _ref$specialColumnsCo = _ref.specialColumnsCount,
      specialColumnsCount = _ref$specialColumnsCo === void 0 ? 0 : _ref$specialColumnsCo,
      mergedCells = _ref.mergedCells,
      totalRows = _ref.totalRows,
      totalColumns = _ref.totalColumns;
  var lastSelection = selectedCells[selectedCells.length - 1];
  var nextSelection;
  var rowEdge = rowOffset > 0 ? Math.max(lastSelection.end.row, lastSelection.start.row, lastSelection.end.row) : Math.min(lastSelection.end.row, lastSelection.start.row, lastSelection.end.row);
  var columnEdge = columnOffset > 0 ? Math.max(lastSelection.end.column, lastSelection.start.column, lastSelection.end.column) : Math.min(lastSelection.end.column, lastSelection.start.column, lastSelection.end.column);
  var endRow = rowEdge + rowOffset;
  var endColumn = columnEdge + columnOffset; // Preventing moving out of value area

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
      nextSelection.start = {
        row: endRow,
        column: endColumn
      };
    }

    nextSelection = expandSelection({
      selection: nextSelection,
      mergedCells: mergedCells,
      rowIndex: endRow,
      columnIndex: endColumn,
      east: rowOffset > 0,
      south: columnOffset > 0
    });
  } else {
    nextSelection = {
      start: {
        row: specialRowsCount,
        column: specialColumnsCount
      },
      end: {
        row: specialRowsCount,
        column: specialColumnsCount
      }
    };
  }

  return [nextSelection];
};

var moveScrollPosition = function moveScrollPosition(_ref2) {
  var selectedCells = _ref2.selectedCells,
      rows = _ref2.rows,
      columns = _ref2.columns,
      fixColumns = _ref2.fixColumns,
      fixRows = _ref2.fixRows,
      defaultRowHeight = _ref2.defaultRowHeight,
      defaultColumnWidth = _ref2.defaultColumnWidth,
      scrollerContainerRect = _ref2.scrollerContainerRect,
      scrollerContainerRef = _ref2.scrollerContainerRef;
  var lastSelection = selectedCells[selectedCells.length - 1];
  var rect = scrollerContainerRect;

  var _getOverscrolledCellO = getOverscrolledCellOffset({
    rows: rows,
    columns: columns,
    defaultRowHeight: defaultRowHeight,
    defaultColumnWidth: defaultColumnWidth,
    rowIndex: lastSelection.end.row,
    columnIndex: lastSelection.end.column,
    fixRows: fixRows,
    fixColumns: fixColumns,
    scrollTop: scrollerContainerRef.current.scrollTop,
    scrollLeft: scrollerContainerRef.current.scrollLeft,
    containerWidth: rect.width,
    containerHeight: rect.height
  }),
      overscrollLeft = _getOverscrolledCellO.overscrollLeft,
      overscrollTop = _getOverscrolledCellO.overscrollTop;

  if (overscrollLeft) scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
  if (overscrollTop) scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
};

var useKeyboard = function useKeyboard(_ref3) {
  var rows = _ref3.rows,
      columns = _ref3.columns,
      specialRowsCount = _ref3.specialRowsCount,
      specialColumnsCount = _ref3.specialColumnsCount,
      fixRows = _ref3.fixRows,
      fixColumns = _ref3.fixColumns,
      mergedCells = _ref3.mergedCells,
      totalRows = _ref3.totalRows,
      totalColumns = _ref3.totalColumns,
      rowsPerPage = _ref3.rowsPerPage,
      defaultRowHeight = _ref3.defaultRowHeight,
      defaultColumnWidth = _ref3.defaultColumnWidth,
      onSelectedCellsChange = _ref3.onSelectedCellsChange,
      scrollerContainerRef = _ref3.scrollerContainerRef;
  var handlingKeyDown = useRef(false);
  var onKeyDown = useCallback(function (event) {
    event.persist();
    event.preventDefault();
    if (handlingKeyDown.current) return;

    var setSelectedCells = function setSelectedCells(append, rowOffset, columnOffset) {
      return function (selectedCells) {
        var nextSelection = moveSelection({
          selectedCells: selectedCells,
          append: append,
          rowOffset: rowOffset,
          columnOffset: columnOffset,
          specialRowsCount: specialRowsCount,
          specialColumnsCount: specialColumnsCount,
          mergedCells: mergedCells,
          totalRows: totalRows,
          totalColumns: totalColumns
        });
        moveScrollPosition({
          selectedCells: nextSelection,
          rowOffset: rowOffset,
          columnOffset: columnOffset,
          rows: rows,
          columns: columns,
          fixColumns: fixColumns,
          fixRows: fixRows,
          defaultRowHeight: defaultRowHeight,
          defaultColumnWidth: defaultColumnWidth,
          scrollerContainerRef: scrollerContainerRef,
          scrollerContainerRect: scrollerContainerRef.current.getBoundingClientRect()
        });
        return nextSelection;
      };
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
        break;

      case 'End':
        if (event.ctrlKey) onSelectedCellsChange(setSelectedCells(event.shiftKey, totalRows, 0));
        break;

      default:
    }

    ;
    handlingKeyDown.current = true;
    setTimeout(function () {
      return handlingKeyDown.current = false;
    }, 50);
  }, [mergedCells, onSelectedCellsChange, specialRowsCount, specialColumnsCount, defaultRowHeight, defaultColumnWidth, rows, columns, fixRows, fixColumns, rowsPerPage, totalRows, totalColumns, scrollerContainerRef]);
  return onKeyDown;
};

export default useKeyboard;