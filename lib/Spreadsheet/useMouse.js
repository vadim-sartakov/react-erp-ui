import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import { useRef, useEffect, useCallback } from 'react';
import { expandSelection, getIndexFromCoordinate, getOverscrolledOffset } from './utils';

var rangesAreEqual = function rangesAreEqual(rangeA, rangeB) {
  return rangeA.start.row === rangeB.start.row && rangeA.start.column === rangeB.start.column && rangeA.end.row === rangeB.end.row && rangeA.end.column === rangeB.end.column;
};

var useMouse = function useMouse(_ref) {
  var rows = _ref.rows,
      columns = _ref.columns,
      specialRowsCount = _ref.specialRowsCount,
      specialColumnsCount = _ref.specialColumnsCount,
      defaultRowHeight = _ref.defaultRowHeight,
      defaultColumnWidth = _ref.defaultColumnWidth,
      totalRows = _ref.totalRows,
      totalColumns = _ref.totalColumns,
      fixRows = _ref.fixRows,
      fixColumns = _ref.fixColumns,
      mergedCells = _ref.mergedCells,
      onSelectedCellsChange = _ref.onSelectedCellsChange,
      scrollerContainerRef = _ref.scrollerContainerRef,
      scrollerCoverRef = _ref.scrollerCoverRef;
  var mousePressed = useRef();
  var scrollerContainerRectRef = useRef();
  var scrollerCoverRectRef = useRef(); // Saving initial sizes to reuse it for performance

  useEffect(function () {
    var rect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  }, [scrollerContainerRef]); // Select interaction

  var isSpecialArea = useCallback(function (rowIndex, columnIndex) {
    return rowIndex < specialRowsCount && rows[rowIndex].type !== 'NUMBER' || columnIndex < specialColumnsCount && columns[columnIndex].type !== 'NUMBER';
  }, [rows, columns, specialRowsCount, specialColumnsCount]);
  var getIndexes = useCallback(function (event, scrollerContainerRect, scrollerCoverRect) {
    var valueTop = event.clientY - scrollerCoverRect.top;
    var valueLeft = event.clientX - scrollerCoverRect.left;
    var valueRowIndex = getIndexFromCoordinate({
      coordinate: valueTop,
      meta: rows,
      defaultSize: defaultRowHeight,
      totalCount: totalRows
    });
    var valueColumnIndex = getIndexFromCoordinate({
      coordinate: valueLeft,
      meta: columns,
      defaultSize: defaultColumnWidth,
      totalCount: totalColumns
    });
    var fixedTop = event.clientY - scrollerContainerRect.top;
    var fixedLeft = event.clientX - scrollerContainerRect.left;
    var fixedRowIndex = getIndexFromCoordinate({
      coordinate: fixedTop,
      meta: rows,
      defaultSize: defaultRowHeight,
      totalCount: fixRows
    });
    var fixedColumnIndex = getIndexFromCoordinate({
      coordinate: fixedLeft,
      meta: columns,
      defaultSize: defaultColumnWidth,
      totalCount: fixColumns
    });
    var rowIndex = fixedRowIndex !== undefined ? fixedRowIndex : valueRowIndex;
    var columnIndex = fixedColumnIndex !== undefined ? fixedColumnIndex : valueColumnIndex;
    return {
      rowIndex: rowIndex,
      columnIndex: columnIndex
    };
  }, [defaultRowHeight, defaultColumnWidth, rows, columns, fixRows, fixColumns, totalRows, totalColumns]);
  var getSelection = useCallback(function (_ref2) {
    var lastSelection = _ref2.lastSelection,
        rowType = _ref2.rowType,
        columnType = _ref2.columnType,
        rowIndex = _ref2.rowIndex,
        columnIndex = _ref2.columnIndex;
    var resultSelection;

    if (rowType === 'NUMBER' && columnType === 'NUMBER') {
      resultSelection = {
        start: {
          row: rowIndex + 1,
          column: columnIndex + 1
        }
      };
      resultSelection = expandSelection({
        selection: resultSelection,
        mergedCells: mergedCells,
        columnIndex: totalColumns - 1,
        rowIndex: totalRows - 1
      });
    } else if (rowType === 'NUMBER') {
      resultSelection = {
        start: {
          row: rowIndex + 1,
          column: lastSelection && lastSelection.start.column || columnIndex
        }
      };
      resultSelection = expandSelection({
        selection: resultSelection,
        mergedCells: mergedCells,
        columnIndex: columnIndex,
        rowIndex: totalRows - 1
      });
    } else if (columnType === 'NUMBER') {
      resultSelection = {
        start: {
          row: lastSelection && lastSelection.start.row || rowIndex,
          column: columnIndex + 1
        }
      };
      resultSelection = expandSelection({
        selection: resultSelection,
        mergedCells: mergedCells,
        columnIndex: totalColumns - 1,
        rowIndex: rowIndex
      });
    } else {
      resultSelection = lastSelection || {
        start: {
          row: rowIndex,
          column: columnIndex
        }
      };
      resultSelection = expandSelection({
        selection: resultSelection,
        mergedCells: mergedCells,
        rowIndex: rowIndex,
        columnIndex: columnIndex
      });
    }

    return resultSelection;
  }, [mergedCells, totalColumns, totalRows]);
  var onMouseDown = useCallback(function (event) {
    event.persist();
    mousePressed.current = true;
    var scrollerContainerRect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = {
      top: scrollerContainerRect.top,
      left: scrollerContainerRect.left,
      width: scrollerContainerRect.width,
      height: scrollerContainerRect.height
    };
    var scrollerCoverRect = scrollerCoverRef.current.getBoundingClientRect();
    scrollerCoverRectRef.current = {
      top: scrollerCoverRect.top,
      left: scrollerCoverRect.left
    };

    var _getIndexes = getIndexes(event, scrollerContainerRect, scrollerCoverRect),
        rowIndex = _getIndexes.rowIndex,
        columnIndex = _getIndexes.columnIndex;

    if (isSpecialArea(rowIndex, columnIndex)) return;
    var rowType = rows[rowIndex].type;
    var columnType = columns[columnIndex].type;
    onSelectedCellsChange(function (selectedCells) {
      var curSelection = getSelection({
        rowType: rowType,
        columnType: columnType,
        rowIndex: rowIndex,
        columnIndex: columnIndex
      });

      if (event.shiftKey) {
        var lastSelection = selectedCells[selectedCells.length - 1];
        var nextLastSelection = getSelection({
          lastSelection: lastSelection,
          rowType: rowType,
          columnType: columnType,
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
        return [nextLastSelection];
      }

      if (event.ctrlKey) {
        // Excluding equal selections
        if (selectedCells.some(function (selectedRange) {
          return rangesAreEqual(selectedRange, curSelection);
        })) return selectedCells;
        return [].concat(_toConsumableArray(selectedCells), [curSelection]);
      }

      return [curSelection];
    });
  }, [columns, rows, onSelectedCellsChange, getIndexes, isSpecialArea, getSelection, scrollerCoverRef, scrollerContainerRef]);
  useEffect(function () {
    // Mouse up is not always triggered, so including onClick as well
    var onMouseUp = function onMouseUp() {
      mousePressed.current = false;
    };

    var onClick = function onClick() {
      mousePressed.current = false;
    };

    var onMouseMove = function onMouseMove(event) {
      if (mousePressed.current) {
        var scrollerContainerRect = scrollerContainerRectRef.current;
        var scrollerCoverRect = scrollerCoverRectRef.current;

        var _getIndexes2 = getIndexes(event, scrollerContainerRect, scrollerCoverRect),
            rowIndex = _getIndexes2.rowIndex,
            columnIndex = _getIndexes2.columnIndex;

        if (isSpecialArea(rowIndex, columnIndex)) return;
        var rowType = rows[rowIndex].type;
        var columnType = columns[columnIndex].type;
        onSelectedCellsChange(function (selectedCells) {
          var lastSelection = selectedCells[selectedCells.length - 1]; // Happens when mouse pressed elsewhere (e.g. heading resizing) thus, there is no last selection

          if (!lastSelection) return selectedCells;
          var nextLastSelection = getSelection({
            lastSelection: lastSelection,
            rowType: rowType,
            columnType: columnType,
            rowIndex: rowIndex,
            columnIndex: columnIndex
          }); // Preventing excessive updates

          if (rangesAreEqual(lastSelection, nextLastSelection)) return selectedCells; // Scrolling if selection goes out of container

          var x = event.clientX - scrollerContainerRectRef.current.left;
          var y = event.clientY - scrollerContainerRectRef.current.top;
          var overscrollLeft = getOverscrolledOffset({
            coordinate: x,
            containerSize: scrollerContainerRectRef.current.width,
            meta: columns,
            fixCount: fixColumns,
            defaultSize: defaultColumnWidth
          });
          var overscrollTop = getOverscrolledOffset({
            coordinate: y,
            containerSize: scrollerContainerRectRef.current.height,
            meta: rows,
            fixCount: fixRows,
            defaultSize: defaultRowHeight
          });

          if (overscrollLeft) {
            scrollerCoverRectRef.current.left = scrollerCoverRectRef.current.left - overscrollLeft;
            scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
          }

          if (overscrollTop) {
            scrollerCoverRectRef.current.top = scrollerCoverRectRef.current.top - overscrollTop;
            scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
          }

          var nextSelectedCells = _toConsumableArray(selectedCells);

          nextSelectedCells[nextSelectedCells.length - 1] = nextLastSelection;
          return nextSelectedCells;
        });
      }

      ;
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);
    return function () {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [fixRows, fixColumns, rows, columns, defaultRowHeight, defaultColumnWidth, totalRows, totalColumns, mergedCells, onSelectedCellsChange, specialRowsCount, specialColumnsCount, isSpecialArea, getIndexes, getSelection, scrollerContainerRef]);
  return onMouseDown;
};

export default useMouse;