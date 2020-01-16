import { useState, useMemo, useCallback } from 'react';
import { getGroups } from './utils';

export const convertExternalMetaToInternal = ({ meta = [], groups, groupSize, numberMetaSize, hideRowColumnNumbers }) => {
  const result = [];
  
  groups.length && [...new Array(groups.length + 1).keys()].forEach(group => result.push({ size: groupSize, type: 'GROUP' }));
  if (!hideRowColumnNumbers) result.push({ size: numberMetaSize, type: 'NUMBER' });
  
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

const clickGroupButton = (meta, level) => {
  const result = meta.map(metaItem => {
    if (!metaItem || !metaItem.level) return metaItem;
    else if (metaItem.level >= level) return { ...metaItem, hidden: true };
    else {
      const nextItem = { ...metaItem };
      delete nextItem.hidden;
      return nextItem;
    };
  });
  return result;
};

/**
 * @param {import('./').UseSpreadsheetOptions} options 
 */
const useSpreadsheet = ({
  value: valueProp,
  onChange: onChangeProp,
  rows: rowsProp,
  onRowsChange: onRowsChangeProp,
  columns: columnsProp,
  onColumnsChange: onColumnsChangeProp,
  columnNumbersRowHeight,
  rowNumberColumnWidth,
  totalRows,
  totalColumns,
  fixRows = 0,
  fixColumns = 0,
  hideRowColumnNumbers,
  groupSize,
  mergedCells: mergedCellsProp
}) => {

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
      numberMetaSize: columnNumbersRowHeight,
      groups,
      groupSize,
      hideRowColumnNumbers
    });
  }, [columnNumbersRowHeight, columns, groupSize, hideRowColumnNumbers]);

  const convertExternalColumnsToInternal = useCallback(columns => {
    const groups = getGroups(rows);
    return convertExternalMetaToInternal({
      meta: columns,
      numberMetaSize: rowNumberColumnWidth,
      groups,
      groupSize,
      hideRowColumnNumbers
    });
  }, [rowNumberColumnWidth, rows, groupSize, hideRowColumnNumbers]);

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

  const handleRowGroupButtonClick = useCallback(level => event => {
    let nextRows = clickGroupButton(rows, level);
    onRowsChange(nextRows);
  }, [rows, onRowsChange]);

  const nextColumns = useMemo(() => {
    const result = [...new Array(totalColumns).keys()].map(key => {
      const curColumn = columns[key];
      return { ...curColumn, key };
    });
    return convertExternalColumnsToInternal(result);
  }, [columns, convertExternalColumnsToInternal, totalColumns]);

  const nextOnColumnsChange = useCallback(setColumns => {
    onColumnsChange(columns => {
      let nextColumns;
      if (typeof setColumns === 'function') nextColumns = setColumns(convertExternalColumnsToInternal(columns));
      else nextColumns = setColumns;
      nextColumns = convertInternalMetaToExternal({ meta: nextColumns, originExternalMeta: columns, hiddenIndexes: hiddenColumnsIndexes });
      return nextColumns;
    });
  }, [convertExternalColumnsToInternal, hiddenColumnsIndexes, onColumnsChange]);

  const handleColumnGroupButtonClick = useCallback(level => event => {
    let nextColumns = clickGroupButton(columns, level);
    onColumnsChange(nextColumns);
  }, [columns, onColumnsChange]);

  const specialRowsCount = useMemo(() => nextRows.filter(row => row && row.type).length, [nextRows]);
  const specialColumnsCount = useMemo(() => nextColumns.filter(column => column && column.type).length, [nextColumns]);

  const [valueState, setValueState] = useState([]);

  const convertExternalValueToInternalCallback = useCallback(value => {
    return convertExternalValueToInternal({
      value,
      specialRowsCount,
      specialColumnsCount,
      hiddenRowsIndexes,
      hiddenColumnsIndexes
    });
  }, [specialRowsCount, specialColumnsCount, hiddenColumnsIndexes, hiddenRowsIndexes]);

  const value = useMemo(() => convertExternalValueToInternalCallback(valueProp || valueState), [convertExternalValueToInternalCallback, valueProp, valueState]);

  const onChange = useCallback(setValue => {
    const onChange = onChangeProp || setValueState;
    onChange(value => {
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
  }, [convertExternalValueToInternalCallback, specialRowsCount, specialColumnsCount, onChangeProp, setValueState]);

  const mergedCells = useMemo(() => {
    return mergedCellsProp && mergedCellsProp.map(mergedRange => {
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
  }, [mergedCellsProp, specialRowsCount, specialColumnsCount]);

  const groupMapper = useCallback(specialMetaCount => group => ({ ...group, start: group.start + specialMetaCount, end: group.end + specialMetaCount }), []);

  const rowsGroups = useMemo(() => {
    return getGroups(rows).map(curLevelGroups => curLevelGroups.map(groupMapper(specialRowsCount)));
  }, [rows, groupMapper, specialRowsCount]);

  const columnsGroups = useMemo(() => {
    return getGroups(columns).map(curLevelGroups => curLevelGroups.map(groupMapper(specialColumnsCount)));
  }, [columns, groupMapper, specialColumnsCount]);

  return {
    value,
    onChange,
    rows: nextRows,
    columns: nextColumns,
    onColumnsChange: nextOnColumnsChange,
    onRowsChange: nextOnRowsChange,
    totalRows: (totalRows + specialRowsCount) - hiddenRowsIndexes.length,
    totalColumns: (totalColumns + specialColumnsCount) - hiddenColumnsIndexes.length,
    fixRows: fixRows + specialRowsCount,
    fixColumns: fixColumns + specialColumnsCount,
    mergedCells,
    specialRowsCount,
    specialColumnsCount,
    rowsGroups,
    columnsGroups,
    handleRowGroupButtonClick,
    handleColumnGroupButtonClick
  };
};

export default useSpreadsheet;