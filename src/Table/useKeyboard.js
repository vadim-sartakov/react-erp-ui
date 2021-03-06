import { useCallback, useRef } from 'react';
import { getOverscrolledCellOffset } from '../Scroller/utils';

const NAVIGATION_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'PageDown',
  'PageUp',
  'Home',
  'End'
];

const moveSelection = ({
  selectedCells,
  append,
  rowOffset = 0,
  columnOffset = 0,
  totalRows,
  totalColumns
}) => {
  const lastSelection = rowOffset >= 0 ? selectedCells[selectedCells.length - 1] : selectedCells[0];
  let nextSelection;

  let endRow = ((lastSelection && lastSelection.row) || 0) + rowOffset;
  let endColumn = ((lastSelection && lastSelection.column) || 0) + columnOffset;

  // Preventing moving out of value area
  endRow = rowOffset > 0 ? Math.min(endRow, totalRows - 1) : Math.max(endRow, 0);
  endColumn = columnOffset > 0 ? Math.min(endColumn, totalColumns - 1) : Math.max(endColumn, 0);

  const curSelection = { row: endRow, column: endColumn };

  if (append) {
    const startRowIndex = selectedCells.reduce((prev, selection) => Math.min(prev, selection.row, curSelection.row), totalRows - 1);
    const endRowIndex = selectedCells.reduce((prev, selection) => Math.max(prev, selection.row, curSelection.row), 0);
    nextSelection = [];
    for (let i = startRowIndex; i <= endRowIndex; i++) {
      nextSelection.push({ row: i });
    }
  } else {
    nextSelection = [curSelection];
  }

  return nextSelection;
};

const moveScrollPosition = ({
  selectedCells,
  columns,
  fixColumns,
  rowOffset,
  showFooter,
  defaultRowHeight,
  defaultColumnWidth, 
  scrollerContainerRect,
  scrollerContainerRef
}) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  const rect = scrollerContainerRect;
  const { overscrollLeft, overscrollTop } = getOverscrolledCellOffset({
    columns,
    defaultRowHeight,
    defaultColumnWidth,
    rowIndex: lastSelection.row,
    columnIndex: lastSelection.column,
    fixColumns,
    // Since header and footer out of scrollable values, making offsets here
    scrollTop: scrollerContainerRef.current.scrollTop - (rowOffset > 0 ? defaultRowHeight : 0) - (rowOffset > 0 && showFooter ? defaultRowHeight : 0),
    scrollLeft: scrollerContainerRef.current.scrollLeft,
    containerWidth: rect.width,
    containerHeight: rect.height
  });
  if (overscrollLeft) scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
  if (overscrollTop) scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
};

const useKeyboard = ({
  onRowAdd,
  onRowDelete,
  editingCell,
  onEditingCellChange,
  scrollerContainerRef,
  columns,
  fixColumns,
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsPerPage,
  selectedCells,
  onSelectedCellsChange,
  showFooter
}) => {
  const handlingKeyDown = useRef(false);

  const onKeyDown = useCallback(event => {
    if (editingCell) return;

    if (!editingCell && NAVIGATION_KEYS.indexOf(event.key) === -1) {
      switch(event.key) {
        case 'Enter':
          const lastSelectedCell = selectedCells[selectedCells.length - 1];
          lastSelectedCell && onEditingCellChange({ row: lastSelectedCell.row, column: lastSelectedCell.column });
          break;
        case 'Insert':
          onRowAdd();
          const nextSelectedCells = [{ row: totalRows, column: 0 }];
          onSelectedCellsChange(nextSelectedCells);
          moveScrollPosition({
            selectedCells: nextSelectedCells,
            columns,
            fixColumns,
            rowOffset: totalRows,
            showFooter,
            defaultRowHeight,
            defaultColumnWidth,
            scrollerContainerRef,
            scrollerContainerRect: scrollerContainerRef.current.getBoundingClientRect()
          });
          break;
        case 'Delete':
          selectedCells.length && onRowDelete && onRowDelete(selectedCells);
          const firstSelection = selectedCells[0];
          onSelectedCellsChange([{ row: firstSelection.row }]);
          break;
        default:
      }
      return;
    }

    event.persist();
    event.preventDefault();

    if (handlingKeyDown.current) return;

    const setSelectedCells = (append, rowOffset, columnOffset) => selectedCells => {
      const nextSelection = moveSelection({
        selectedCells,
        append,
        rowOffset,
        columnOffset,
        totalRows,
        totalColumns
      });
      moveScrollPosition({
        selectedCells: nextSelection,
        showFooter,
        rowOffset,
        columnOffset,
        columns,
        fixColumns,
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
        break;
      default:
    };
    
    handlingKeyDown.current = true;
    setTimeout(() => handlingKeyDown.current = false, 50);
    
  }, [
    selectedCells,
    editingCell,
    onEditingCellChange,
    showFooter,
    fixColumns,
    scrollerContainerRef,
    columns,
    totalColumns,
    defaultColumnWidth,
    defaultRowHeight,
    rowsPerPage,
    totalRows,
    onSelectedCellsChange,
    onRowAdd,
    onRowDelete
  ]);

  return onKeyDown;
};

export default useKeyboard;