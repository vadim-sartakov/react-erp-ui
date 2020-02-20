import { useRef, useEffect, useCallback } from 'react';
import { expandSelection, getIndexFromCoordinate } from './utils';
import { getOverscrolledCoordinateOffset } from '../Scroller/utils';
import { getCellsRangeSize } from '../MergedCell/utils';

const rangesAreEqual = (rangeA, rangeB) => {
  return rangeA.start.row === rangeB.start.row &&
      rangeA.start.column === rangeB.start.column &&
      rangeA.end.row === rangeB.end.row &&
      rangeA.end.column === rangeB.end.column
};

const useMouse = ({
  rows,
  columns,
  specialRowsCount,
  specialColumnsCount,
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  fixRows,
  fixColumns,
  mergedCells,
  onSelectedCellsChange,
  scrollerContainerRef,
  scrollerCoverRef
}) => {
  const mousePressed = useRef();
  const scrollerContainerRectRef = useRef();
  const scrollerCoverRectRef = useRef();

  // Saving initial sizes to reuse it for performance
  useEffect(() => {
    const rect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  }, [scrollerContainerRef]);

  // Select interaction
  const isSpecialArea = useCallback((rowIndex, columnIndex) => (rowIndex < specialRowsCount && rows[rowIndex].type !== 'NUMBER') ||
      (columnIndex < specialColumnsCount && columns[columnIndex].type !== 'NUMBER'), [rows, columns, specialRowsCount, specialColumnsCount]);

  const getIndexes = useCallback((event, scrollerContainerRect, scrollerCoverRect) => {
    const valueTop = event.clientY - scrollerCoverRect.top;
    const valueLeft = event.clientX - scrollerCoverRect.left;
    const valueRowIndex = getIndexFromCoordinate({ coordinate: valueTop, meta: rows, defaultSize: defaultRowHeight, totalCount: totalRows });
    const valueColumnIndex = getIndexFromCoordinate({ coordinate: valueLeft, meta: columns, defaultSize: defaultColumnWidth, totalCount: totalColumns });
  
    const fixedTop = event.clientY - scrollerContainerRect.top;
    const fixedLeft = event.clientX - scrollerContainerRect.left;
    const fixedRowIndex = getIndexFromCoordinate({ coordinate: fixedTop, meta: rows, defaultSize: defaultRowHeight, totalCount: fixRows });
    const fixedColumnIndex = getIndexFromCoordinate({ coordinate: fixedLeft, meta: columns, defaultSize: defaultColumnWidth, totalCount: fixColumns });
  
    const rowIndex = fixedRowIndex !== undefined ? fixedRowIndex : valueRowIndex;
    const columnIndex = fixedColumnIndex !== undefined ? fixedColumnIndex : valueColumnIndex;

    return { rowIndex, columnIndex };
  }, [defaultRowHeight, defaultColumnWidth, rows, columns, fixRows, fixColumns, totalRows, totalColumns]);

  const getSelection = useCallback(({ lastSelection, rowType, columnType, rowIndex, columnIndex }) => {
    let resultSelection;
    if (rowType === 'NUMBER' && columnType === 'NUMBER') {
      resultSelection = {
        start: { row: rowIndex + 1, column: columnIndex + 1 }
      };
      resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex: totalColumns - 1, rowIndex: totalRows - 1 });
    } else if (rowType === 'NUMBER') {
      resultSelection = {
        start: { row: rowIndex + 1, column: (lastSelection && lastSelection.start.column) || columnIndex }
      };
      resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex, rowIndex: totalRows - 1 });
    } else if (columnType === 'NUMBER') {
      resultSelection = {
        start: { row: (lastSelection && lastSelection.start.row) || rowIndex, column: columnIndex + 1 }
      };
      resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex: totalColumns - 1, rowIndex });
    } else {
      resultSelection = lastSelection || {
        start: { row: rowIndex, column: columnIndex }
      };
      resultSelection = expandSelection({ selection: resultSelection, mergedCells, rowIndex, columnIndex });
    }
    return resultSelection;
  }, [mergedCells, totalColumns, totalRows]);

  const onMouseDown = useCallback(event => {
    event.persist();
    mousePressed.current = true;

    const scrollerContainerRect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = { top: scrollerContainerRect.top, left: scrollerContainerRect.left, width: scrollerContainerRect.width, height: scrollerContainerRect.height };

    const scrollerCoverRect = scrollerCoverRef.current.getBoundingClientRect();      
    scrollerCoverRectRef.current = { top: scrollerCoverRect.top, left: scrollerCoverRect.left };

    const { rowIndex, columnIndex } = getIndexes(event, scrollerContainerRect, scrollerCoverRect);
    
    if (isSpecialArea(rowIndex, columnIndex)) return;

    const rowType = rows[rowIndex].type;
    const columnType = columns[columnIndex].type;

    onSelectedCellsChange(selectedCells => {
      const curSelection = getSelection({ rowType, columnType, rowIndex, columnIndex });

      if (event.shiftKey) {
        const lastSelection = selectedCells[selectedCells.length - 1];
        const nextLastSelection = getSelection({ lastSelection, rowType, columnType, rowIndex, columnIndex });
        return [nextLastSelection];
      }
      if (event.ctrlKey) {
        // Excluding equal selections
        if (selectedCells.some(selectedRange => rangesAreEqual(selectedRange, curSelection))) return selectedCells;
        return [...selectedCells, curSelection]
      }
      return [curSelection];
    });
  }, [columns, rows, onSelectedCellsChange, getIndexes, isSpecialArea, getSelection, scrollerCoverRef, scrollerContainerRef]);

  useEffect(() => {

    // Mouse up is not always triggered, so including onClick as well
    const onMouseUp = () => {
      mousePressed.current = false;
    };

    const onClick = () => {
      mousePressed.current = false;
    };

    const onMouseMove = event => {
      if (mousePressed.current) {
        const scrollerContainerRect = scrollerContainerRectRef.current;
        const scrollerCoverRect = scrollerCoverRectRef.current;

        const { rowIndex, columnIndex } = getIndexes(event, scrollerContainerRect, scrollerCoverRect);
        if (isSpecialArea(rowIndex, columnIndex)) return;
        
        const rowType = rows[rowIndex].type;
        const columnType = columns[columnIndex].type;

        onSelectedCellsChange(selectedCells => {
          const lastSelection = selectedCells[selectedCells.length - 1];

          // Happens when mouse pressed elsewhere (e.g. heading resizing) thus, there is no last selection
          if (!lastSelection) return selectedCells;

          const nextLastSelection = getSelection({ lastSelection, rowType, columnType, rowIndex, columnIndex });
          // Preventing excessive updates
          if (rangesAreEqual(lastSelection, nextLastSelection)) return selectedCells;

          // Scrolling if selection goes out of container
          const x = event.clientX - scrollerContainerRectRef.current.left;
          const y = event.clientY - scrollerContainerRectRef.current.top;
          const fixedRowsSize = getCellsRangeSize({ startIndex: 0, meta: rows, count: fixRows, defaultSize: defaultRowHeight });
          const fixedColumnsSize = getCellsRangeSize({ startIndex: 0, meta: columns, count: fixColumns, defaultSize: defaultColumnWidth });
          const overscrollLeft = getOverscrolledCoordinateOffset({ coordinate: x, containerSize: scrollerContainerRectRef.current.width, fixedSize: fixedColumnsSize });
          const overscrollTop = getOverscrolledCoordinateOffset({ coordinate: y, containerSize: scrollerContainerRectRef.current.height, fixedSize: fixedRowsSize });
          if (overscrollLeft) {
            scrollerCoverRectRef.current.left = scrollerCoverRectRef.current.left - overscrollLeft;
            scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
          }
          if (overscrollTop) {
            scrollerCoverRectRef.current.top = scrollerCoverRectRef.current.top - overscrollTop;
            scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
          }

          const nextSelectedCells = [...selectedCells];
          nextSelectedCells[nextSelectedCells.length - 1] = nextLastSelection;
          return nextSelectedCells;
        });
      };
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, [
    fixRows,
    fixColumns,
    rows,
    columns,
    defaultRowHeight,
    defaultColumnWidth,
    totalRows,
    totalColumns,
    mergedCells,
    onSelectedCellsChange,
    specialRowsCount,
    specialColumnsCount,
    isSpecialArea,
    getIndexes,
    getSelection,
    scrollerContainerRef
  ]);

  return onMouseDown;
}

export default useMouse;