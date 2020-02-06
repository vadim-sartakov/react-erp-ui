import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { getGroups, getIndexFromCoordinate, expandSelection } from './utils';
import { getCellPosition, getCellsRangeSize } from '../utils/gridUtils';

export const convertExternalMetaToInternal = ({ meta = [], groups, groupSize, numberMetaSize, hideHeadings }) => {
  const result = [];
  
  groups.length && [...new Array(groups.length + 1).keys()].forEach(group => result.push({ size: groupSize, type: 'GROUP' }));
  if (!hideHeadings) result.push({ size: numberMetaSize, type: 'NUMBER' });
  
  // Not using filter here because meta may contain empty items
  // And it's not processing by filter function
  let filteredMeta = [...meta];
  for (let index = 0; index < filteredMeta.length; index++) {
    const metaItem = filteredMeta[index];
    if (metaItem && metaItem.hidden) {
      filteredMeta.splice(index, 1);
      index -= 1;
    }
  }
  result.push(...filteredMeta);
  return result;
};

export const convertInternalMetaToExternal = ({ meta, originExternalMeta, hiddenIndexes }) => {
  let result = [...meta].filter(metaItem => metaItem ? !metaItem.type : true);
  hiddenIndexes.forEach(index => result.splice(index, 0, originExternalMeta[index]));
  return result;
};

export const convertExternalValueToInternal = ({ value, specialRowsCount, specialColumnsCount, hiddenRowsIndexes, hiddenColumnsIndexes }) => {
  let result = value;
  if (hiddenRowsIndexes) result = result.filter((row, index) => hiddenRowsIndexes.indexOf(index) === -1);
  if (hiddenColumnsIndexes) result = result.map(row => row.filter((column, index) => hiddenColumnsIndexes.indexOf(index) === -1));

  if (specialRowsCount) result = [...new Array(specialRowsCount), ...result];
  if (specialColumnsCount) result = result.map(row => row ? [...new Array(specialColumnsCount), ...(row || [])] : row);
  return result;
};

export const convertInternalValueToExternal = ({ value, originExternalValue, hiddenRowsIndexes, hiddenColumnsIndexes, specialRowsCount, specialColumnsCount }) => {
  let result = [...value];
  if (specialRowsCount) result.splice(0, specialRowsCount);
  if (specialColumnsCount) result = result.map(row => {
    if (!row) return row;
    const nextRow = [...row];
    nextRow.splice(0, specialColumnsCount);
    return nextRow;
  });
  hiddenRowsIndexes.forEach(index => result.splice(index, 0, originExternalValue[index]));
  if (hiddenColumnsIndexes) result = result.map((row, rowIndex) => {
    if (hiddenRowsIndexes.indexOf(rowIndex) !== -1 || !row) return row;
    const nextRow = [...row];
    hiddenColumnsIndexes.forEach(columnIndex => nextRow.splice(columnIndex, 0, originExternalValue[rowIndex][columnIndex]));
    return nextRow;
  });
  return result;
};

const clickGroupLevelButton = (meta, level) => {
  return meta.map(metaItem => {
    if (!metaItem || !metaItem.level) return metaItem;
    else if (metaItem.level >= level) return { ...metaItem, hidden: true };
    else {
      const nextItem = { ...metaItem };
      delete nextItem.hidden;
      return nextItem;
    }
  });
};

const clickGroupButton = (meta, group, specialMetaCount) => {
  const nextMeta = [...meta];
  for (let index = group.start - specialMetaCount; index <= group.end - specialMetaCount; index++) {
    const metaItem = meta[index] || {};
    if (group.collapsed && metaItem.level > group.level) continue;
    nextMeta[index] = { ...metaItem, hidden: !group.collapsed };
  }
  return nextMeta;
};

const rangesAreEqual = (rangeA, rangeB) => {
  return rangeA.start.row === rangeB.start.row &&
      rangeA.start.column === rangeB.start.column &&
      rangeA.end.row === rangeB.end.row &&
      rangeA.end.column === rangeB.end.column
};

const getOverscrolledOffset = ({ coordinate, containerSize, meta, fixCount, defaultSize }) => {
  const fixedSize = getCellsRangeSize({ meta, count: fixCount, defaultSize });
  const startOverscroll = coordinate - fixedSize;
  const endOverscroll = coordinate - containerSize;
  if (startOverscroll < 0) return startOverscroll;
  else if (endOverscroll > 0) return endOverscroll;
};

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

const moveScrollPosition = ({ selectedCells, rowOffset, columnOffset, nextRows, nextColumns, nextFixColumns, nextFixRows, defaultRowHeight, defaultColumnWidth, scrollerContainerRectRef, scrollerContainerRef }) => {
  const lastSelection = selectedCells[selectedCells.length - 1];
  let x = getCellPosition({ meta: nextColumns, index: lastSelection.end.column, defaultSize: defaultColumnWidth });
  let y = getCellPosition({ meta: nextRows, index: lastSelection.end.row, defaultSize: defaultRowHeight });
  
  if (rowOffset > 0) y += (nextRows[lastSelection.end.row] && nextRows[lastSelection.end.row].size) || defaultRowHeight;
  if (columnOffset > 0) x += (nextColumns[lastSelection.end.column] && nextColumns[lastSelection.end.column].size) || defaultColumnWidth;

  const rect = scrollerContainerRectRef.current;

  x -= scrollerContainerRef.current.scrollLeft;
  y -= scrollerContainerRef.current.scrollTop;

  const overscrollLeft = getOverscrolledOffset({ coordinate: x, containerSize: rect.width, meta: nextColumns, fixCount: nextFixColumns, defaultSize: defaultColumnWidth });
  const overscrollTop = getOverscrolledOffset({ coordinate: y, containerSize: rect.height, meta: nextRows, fixCount: nextFixRows, defaultSize: defaultRowHeight });

  if (overscrollLeft) scrollerContainerRef.current.scrollLeft = scrollerContainerRef.current.scrollLeft + overscrollLeft;
  if (overscrollTop) scrollerContainerRef.current.scrollTop = scrollerContainerRef.current.scrollTop + overscrollTop;
};

/**
 * @param {import('.').UseSpreadsheetOptions} options
 * @returns {import('.').UseSpreadsheetResult}
 */
const useSpreadsheet = ({
  cells: cellsProp,
  onCellsChange: onCellsChangeProp,
  defaultRowHeight,
  defaultColumnWidth,
  rows: rowsProp,
  onRowsChange: onRowsChangeProp,
  columns: columnsProp,
  onColumnsChange: onColumnsChangeProp,
  selectedCells: selectedCellsProp,
  onSelectedCellsChange: onSelectedCellsChangeProp,
  columnHeadingHeight,
  rowHeadingWidth,
  rowsPerPage,
  totalRows,
  totalColumns,
  fixRows = 0,
  fixColumns = 0,
  hideHeadings,
  groupSize,
  mergedCells: mergedCellsProp
}) => {

  const [selectedCellsState, setSelectedCellsState] = useState([]);
  const selectedCells = selectedCellsProp || selectedCellsState;
  const onSelectedCellsChange = onSelectedCellsChangeProp || setSelectedCellsState;

  const [rowsState, setRowsState] = useState([]);
  const [columnsState, setColumnsState] = useState([]);

  const rows = rowsProp || rowsState;
  const columns = columnsProp || columnsState;

  const onRowsChange = onRowsChangeProp || setRowsState;
  const onColumnsChange = onColumnsChangeProp || setColumnsState

  const metaReducer = useCallback((acc, metaItem, index) => metaItem && metaItem.hidden ? [...acc, index] : acc, []);
  const hiddenRowsIndexes = useMemo(() => rows.reduce(metaReducer, []), [rows, metaReducer]);
  const hiddenColumnsIndexes = useMemo(() => columns.reduce(metaReducer, []), [columns, metaReducer]);

  const convertExternalRowsToInternal = useCallback(rows => {
    const groups = getGroups(columns);
    return convertExternalMetaToInternal({
      meta: rows,
      numberMetaSize: columnHeadingHeight,
      groups,
      groupSize,
      hideHeadings
    });
  }, [columnHeadingHeight, columns, groupSize, hideHeadings]);

  const convertExternalColumnsToInternal = useCallback(columns => {
    const groups = getGroups(rows);
    return convertExternalMetaToInternal({
      meta: columns,
      numberMetaSize: rowHeadingWidth,
      groups,
      groupSize,
      hideHeadings
    });
  }, [rowHeadingWidth, rows, groupSize, hideHeadings]);

  const nextRows = useMemo(() => {
    const result = [...new Array(totalRows).keys()].map(key => {
      const curRow = rows[key];
      return { ...curRow, key };
    });
    return convertExternalRowsToInternal(result);
  }, [rows, totalRows, convertExternalRowsToInternal]);

  const nextOnRowsChange = useCallback(setRows => {
    onRowsChange(rows => {
      let nextRows;
      if (typeof setRows === 'function') nextRows = setRows(convertExternalRowsToInternal(rows));
      else nextRows = setRows;
      nextRows = convertInternalMetaToExternal({ meta: nextRows, originExternalMeta: rows, hiddenIndexes: hiddenRowsIndexes });
      return nextRows;
    });
  }, [onRowsChange, convertExternalRowsToInternal, hiddenRowsIndexes]);

  const specialRowsCount = useMemo(() => nextRows.filter(row => row && row.type).length, [nextRows]);

  const onRowGroupLevelButtonClick = useCallback(level => event => onRowsChange(clickGroupLevelButton(rows, level)), [rows, onRowsChange]);
  const onRowGroupButtonClick = useCallback(group => event => onRowsChange(clickGroupButton(rows, group, specialRowsCount)), [rows, onRowsChange, specialRowsCount]);

  const nextColumns = useMemo(() => {
    const result = [...new Array(totalColumns).keys()].map(key => {
      const curColumn = columns[key];
      return { ...curColumn, key };
    });
    return convertExternalColumnsToInternal(result);
  }, [columns, convertExternalColumnsToInternal, totalColumns]);

  const specialColumnsCount = useMemo(() => nextColumns.filter(column => column && column.type).length, [nextColumns]);

  const nextOnColumnsChange = useCallback(setColumns => {
    onColumnsChange(columns => {
      let nextColumns;
      if (typeof setColumns === 'function') nextColumns = setColumns(convertExternalColumnsToInternal(columns));
      else nextColumns = setColumns;
      nextColumns = convertInternalMetaToExternal({ meta: nextColumns, originExternalMeta: columns, hiddenIndexes: hiddenColumnsIndexes });
      return nextColumns;
    });
  }, [convertExternalColumnsToInternal, hiddenColumnsIndexes, onColumnsChange]);

  const onColumnGroupLevelButtonClick = useCallback(level => event => onColumnsChange(clickGroupLevelButton(columns, level)), [columns, onColumnsChange]);
  const onColumnGroupButtonClick = useCallback(group => event => onColumnsChange(clickGroupButton(columns, group, specialColumnsCount)), [columns, onColumnsChange, specialColumnsCount]);

  const [cellsState, setCellsState] = useState([]);

  const cells = cellsProp || cellsState;
  const onCellsChange = onCellsChangeProp || setCellsState;

  const convertExternalValueToInternalCallback = useCallback(value => {
    return convertExternalValueToInternal({
      value,
      specialRowsCount,
      specialColumnsCount,
      hiddenRowsIndexes,
      hiddenColumnsIndexes
    });
  }, [specialRowsCount, specialColumnsCount, hiddenColumnsIndexes, hiddenRowsIndexes]);

  const nextValue = convertExternalValueToInternal({
    value: cells,
    specialRowsCount,
    specialColumnsCount,
    hiddenRowsIndexes,
    hiddenColumnsIndexes
  });

  const nextOnChange = useCallback(setValue => {
    onCellsChange(value => {
      let nextValue;
      if (typeof value === 'function') nextValue = setValue(convertExternalValueToInternalCallback(value));
      else nextValue = setValue;
      if (specialRowsCount) nextValue = nextValue.splice(0, specialRowsCount);
      if (specialColumnsCount) nextValue = nextValue.map(row => {
        const nextRow = [...row];
        nextRow.splice(0, specialColumnsCount);
        return nextRow;
      });
      return nextValue;
    });
  }, [convertExternalValueToInternalCallback, specialRowsCount, specialColumnsCount, onCellsChange]);

  // Using mapper here because we calculated groups based on external (not filtered meta)
  // We can't calculate groups of internal meta because it does not have hidden items
  // Thus, we need to apply special meta offset
  const groupMapper = useCallback(specialMetaCount => group => ({
    ...group,
    start: group.start + specialMetaCount,
    end: group.end + specialMetaCount,
    offsetStart: group.offsetStart + specialMetaCount,
    offsetEnd: group.offsetEnd + specialMetaCount
  }), []);

  const rowsGroups = useMemo(() => {
    return getGroups(rows).map(curLevelGroups => curLevelGroups.map(groupMapper(specialRowsCount)));
  }, [rows, groupMapper, specialRowsCount]);

  const columnsGroups = useMemo(() => {
    return getGroups(columns).map(curLevelGroups => curLevelGroups.map(groupMapper(specialColumnsCount)));
  }, [columns, groupMapper, specialColumnsCount]);

  const mergedCells = useMemo(() => {
    const mergedCellsWithOffset =  (mergedCellsProp || []).map(mergedRange => {
      return {
        start: {
          row: mergedRange.start.row + specialRowsCount,
          column: mergedRange.start.column + specialColumnsCount
        },
        end: {
          row: mergedRange.end.row + specialRowsCount,
          column: mergedRange.end.column + specialColumnsCount
        }
      }
    });
    // Adding groups merges
    const mergedRowGroups = rowsGroups.reduce((acc, rowLevelGroups, level) => {
      const rowGroups = rowLevelGroups.reduce((acc, rowGroup) => {
        return [
          ...acc,
          {
            start: {
              row: rowGroup.offsetStart - 1,
              column: level
            },
            end: {
              row: rowGroup.collapsed ? rowGroup.offsetStart - 1 : rowGroup.offsetEnd,
              column: level
            }
          }
        ]
      }, []);
      return [
        ...acc,
        ...rowGroups
      ]
    }, []);
    const mergedColumnsGroups = columnsGroups.reduce((acc, columnLevelGroups, level) => {
      const columnGroups = columnLevelGroups.reduce((acc, columnGroup) => {
        return [
          ...acc,
          {
            start: {
              row: level,
              column: columnGroup.offsetStart - 1
            },
            end: {
              row: level,
              column: columnGroup.collapsed ? columnGroup.offsetStart - 1 : columnGroup.offsetEnd
            }
          }
        ]
      }, []);
      return [
        ...acc,
        ...columnGroups
      ]
    }, []);
    return [
      ...mergedCellsWithOffset,
      ...mergedRowGroups,
      ...mergedColumnsGroups
    ];
  }, [mergedCellsProp, specialRowsCount, specialColumnsCount, rowsGroups, columnsGroups]);

  const nextTotalRows = (totalRows + specialRowsCount) - hiddenRowsIndexes.length;
  const nextTotalColumns = (totalColumns + specialColumnsCount) - hiddenColumnsIndexes.length;

  const nextFixRows = fixRows + specialRowsCount;
  const nextFixColumns = fixColumns + specialColumnsCount;

  const mousePressed = useRef();

  const scrollerContainerRef = useRef();
  const scrollerContainerRectRef = useRef();
  const scrollerCoverRef = useRef();
  const scrollerCoverRectRef = useRef();
  const spreadsheetContainerRef = useRef();

  useEffect(() => {
    const rect = scrollerContainerRef.current.getBoundingClientRect();
    scrollerContainerRectRef.current = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  }, []);

  // Select interaction
  useEffect(() => {
    const getIndexes = (event, scrollerContainerRect, scrollerCoverRect) => {
      const valueTop = event.clientY - scrollerCoverRect.top;
      const valueLeft = event.clientX - scrollerCoverRect.left;
      const valueRowIndex = getIndexFromCoordinate({ coordinate: valueTop, meta: nextRows, defaultSize: defaultRowHeight, totalCount: nextTotalRows });
      const valueColumnIndex = getIndexFromCoordinate({ coordinate: valueLeft, meta: nextColumns, defaultSize: defaultColumnWidth, totalCount: nextTotalColumns });

      const fixedTop = event.clientY - scrollerContainerRect.top;
      const fixedLeft = event.clientX - scrollerContainerRect.left;
      const fixedRowIndex = getIndexFromCoordinate({ coordinate: fixedTop, meta: nextRows, defaultSize: defaultRowHeight, totalCount: nextFixRows });
      const fixedColumnIndex = getIndexFromCoordinate({ coordinate: fixedLeft, meta: nextColumns, defaultSize: defaultColumnWidth, totalCount: nextFixColumns });

      const rowIndex = fixedRowIndex !== undefined ? fixedRowIndex : valueRowIndex;
      const columnIndex = fixedColumnIndex !== undefined ? fixedColumnIndex : valueColumnIndex;

      return { rowIndex, columnIndex };
    };

    const getSelection = ({ lastSelection, rowType, columnType, rowIndex, columnIndex }) => {
      let resultSelection;
      if (rowType === 'NUMBER' && columnType === 'NUMBER') {
        resultSelection = {
          start: { row: rowIndex + 1, column: columnIndex + 1 }
        };
        resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex: nextTotalColumns - 1, rowIndex: nextTotalRows - 1 });
      } else if (rowType === 'NUMBER') {
        resultSelection = {
          start: { row: rowIndex + 1, column: (lastSelection && lastSelection.start.column) || columnIndex }
        };
        resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex, rowIndex: nextTotalRows - 1 });
      } else if (columnType === 'NUMBER') {
        resultSelection = {
          start: { row: (lastSelection && lastSelection.start.row) || rowIndex, column: columnIndex + 1 }
        };
        resultSelection = expandSelection({ selection: resultSelection, mergedCells, columnIndex: nextTotalColumns - 1, rowIndex });
      } else {
        resultSelection = lastSelection || {
          start: { row: rowIndex, column: columnIndex }
        };
        resultSelection = expandSelection({ selection: resultSelection, mergedCells, rowIndex, columnIndex });
      }
      return resultSelection;
    };

    const isSpecialArea = (rowIndex, columnIndex) => (rowIndex < specialRowsCount && nextRows[rowIndex].type !== 'NUMBER') ||
        (columnIndex < specialColumnsCount && nextColumns[columnIndex].type !== 'NUMBER');

    const onMouseDown = event => {
      if (!scrollerCoverRef.current || !scrollerCoverRef.current.contains(event.target)) return;

      mousePressed.current = true;

      const scrollerContainerRect = scrollerContainerRef.current.getBoundingClientRect();
      scrollerContainerRectRef.current = { top: scrollerContainerRect.top, left: scrollerContainerRect.left, width: scrollerContainerRect.width, height: scrollerContainerRect.height };

      const scrollerCoverRect = scrollerCoverRef.current.getBoundingClientRect();      
      scrollerCoverRectRef.current = { top: scrollerCoverRect.top, left: scrollerCoverRect.left };

      const { rowIndex, columnIndex } = getIndexes(event, scrollerContainerRect, scrollerCoverRect);
      
      if (isSpecialArea(rowIndex, columnIndex)) return;

      const rowType = nextRows[rowIndex].type;
      const columnType = nextColumns[columnIndex].type;

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
    };

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
        
        const rowType = nextRows[rowIndex].type;
        const columnType = nextColumns[columnIndex].type;

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
          const overscrollLeft = getOverscrolledOffset({ coordinate: x, containerSize: scrollerContainerRectRef.current.width, meta: nextColumns, fixCount: nextFixColumns, defaultSize: defaultColumnWidth });
          const overscrollTop = getOverscrolledOffset({ coordinate: y, containerSize: scrollerContainerRectRef.current.height, meta: nextRows, fixCount: nextFixRows, defaultSize: defaultRowHeight });
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

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, [
    nextFixRows,
    nextFixColumns,
    nextRows,
    nextColumns,
    defaultRowHeight,
    defaultColumnWidth,
    nextTotalRows,
    nextTotalColumns,
    mergedCells,
    onSelectedCellsChange,
    specialRowsCount,
    specialColumnsCount
  ]);

  // Keyboard
  const onKeyDown = useCallback(event => {
    event.persist();
    event.preventDefault();
    
    const setSelectedCells = (append, rowOffset, columnOffset) => selectedCells => {
      const nextSelection = moveSelection({ selectedCells, append, rowOffset, columnOffset, specialRowsCount, specialColumnsCount, mergedCells, totalRows: nextTotalRows, totalColumns: nextTotalColumns });
      moveScrollPosition({ selectedCells: nextSelection, rowOffset, columnOffset, nextRows, nextColumns, nextFixColumns, nextFixRows, defaultRowHeight, defaultColumnWidth, scrollerContainerRef, scrollerContainerRectRef });
      return nextSelection;
    }

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
      default:
    };
  }, [
    mergedCells,
    onSelectedCellsChange,
    specialRowsCount,
    specialColumnsCount,
    defaultRowHeight,
    defaultColumnWidth,
    nextRows,
    nextColumns,
    nextFixRows,
    nextFixColumns,
    rowsPerPage,
    nextTotalRows,
    nextTotalColumns
  ]);

  return {
    cells: nextValue,
    onCellsChange: nextOnChange,
    rows: nextRows,
    columns: nextColumns,
    onColumnsChange: nextOnColumnsChange,
    onRowsChange: nextOnRowsChange,
    selectedCells,
    onSelectedCellsChange,
    totalRows: nextTotalRows,
    totalColumns: nextTotalColumns,
    fixRows: nextFixRows,
    fixColumns: nextFixColumns,
    mergedCells,
    specialRowsCount,
    specialColumnsCount,
    rowsGroups,
    columnsGroups,
    onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick,
    onRowGroupButtonClick,
    onColumnGroupButtonClick,
    scrollerContainerRef,
    scrollerCoverRef,
    spreadsheetContainerRef,
    onKeyDown
  };
};

export default useSpreadsheet;