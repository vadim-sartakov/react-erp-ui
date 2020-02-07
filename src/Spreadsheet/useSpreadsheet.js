import { useRef, useState, useMemo, useCallback } from 'react';
import { getGroups } from './utils';

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

/**
 * @param {import('.').UseSpreadsheetOptions} options
 * @returns {import('.').UseSpreadsheetResult}
 */
const useSpreadsheet = ({
  cells: cellsProp,
  onCellsChange: onCellsChangeProp,
  rows: rowsProp,
  onRowsChange: onRowsChangeProp,
  columns: columnsProp,
  onColumnsChange: onColumnsChangeProp,
  selectedCells: selectedCellsProp,
  onSelectedCellsChange: onSelectedCellsChangeProp,
  columnHeadingHeight,
  rowHeadingWidth,
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

  const scrollerContainerRef = useRef();
  const scrollerCoverRef = useRef();
  const spreadsheetContainerRef = useRef();

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
    spreadsheetContainerRef
  };
};

export default useSpreadsheet;