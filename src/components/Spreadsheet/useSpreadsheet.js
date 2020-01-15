import { useState, useMemo, useCallback } from 'react';
import { getGroups } from './utils';

export const convertExternalMetaToInternal = ({ meta = [], groups, groupSize, numberMetaSize, hiddenIndexes, hideRowColumnNumbers }) => {
  const result = [];
  
  groups.length && [...new Array(groups.length + 1).keys()].forEach(group => result.push({ size: groupSize, type: 'GROUP' }));
  if (!hideRowColumnNumbers) result.push({ size: numberMetaSize, type: 'NUMBER' });
  
  const filteredMeta = meta.filter((metaItem, index) => metaItem ? hiddenIndexes.indexOf(index) === -1 : true);
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

  const metaReducer = useCallback((acc, metaItem, index) => metaItem && metaItem.hidden ? [...acc, index] : acc, []);
  const hiddenRowsIndexes = useMemo(() => rows.reduce(metaReducer, []), [rows, metaReducer]);
  const hiddenColumnsIndexes = useMemo(() => columns.reduce(metaReducer, []), [columns, metaReducer]);

  const transformRows = useCallback(rows => {
    const result = [];
    const groups = getGroups(columns);
    groups.length && [...new Array(groups.length + 1).keys()].forEach(group => result.push({ size: groupSize, type: 'GROUP' }));
    if (!hideRowColumnNumbers) result.push({ size: columnNumbersRowHeight, type: 'NUMBER' });
    result.push(...(rows || []));
    return result;
  }, [columnNumbersRowHeight, hideRowColumnNumbers, groupSize, columns]);

  const nextRows = useMemo(() => transformRows(rows), [rows, transformRows]);

  const onRowsChange = useCallback(setRows => {
    const onRowsChange = onRowsChangeProp || setRowsState;
    onRowsChange(rows => {
      let nextRows;
      if (typeof setRows === 'function') nextRows = setRows(transformRows(rows));
      else nextRows = setRows;
      nextRows = [...nextRows].filter(row => row ? !row.type : true);
      return nextRows;
    });
  }, [onRowsChangeProp, setRowsState, transformRows]);

  const transformColumns = useCallback(columns => {
    const result = [];
    const groups = getGroups(rows);
    groups.length && [...new Array(groups.length + 1).keys()].forEach((group, index) => result.push({ size: groupSize, type: 'GROUP', index }));
    if (!hideRowColumnNumbers) result.push({ size: rowNumberColumnWidth, type: 'NUMBER' });
    result.push(...(columns || []));
    return result;
  }, [rowNumberColumnWidth, hideRowColumnNumbers, groupSize, rows]);

  const nextColumns = useMemo(() => transformColumns(columns), [transformColumns, columns]);

  const onColumnsChange = useCallback(setColumns => {
    const onColumnsChange = onColumnsChangeProp || setColumnsState;
    onColumnsChange(columns => {
      let nextColumns;
      if (typeof setColumns === 'function') nextColumns = setColumns(transformColumns(columns));
      else nextColumns = setColumns;
      nextColumns = [...nextColumns].filter(column => column ? !column.type : true);
      return nextColumns;
    });
  }, [onColumnsChangeProp, transformColumns]);

  const specialRowsCount = useMemo(() => nextRows.filter(row => row && row.type).length, [nextRows]);
  const specialColumnsCount = useMemo(() => nextColumns.filter(column => column && column.type).length, [nextColumns]);

  const [valueState, setValueState] = useState([]);

  const transformValue = useCallback(value => {
    let result = value;
    if (specialRowsCount) result = [...new Array(specialRowsCount), ...value];
    if (specialColumnsCount) result = result.map(row => [...new Array(specialColumnsCount), ...(row || [])]);
    return result;
  }, [specialRowsCount, specialColumnsCount]);

  const value = useMemo(() => transformValue(valueProp || valueState), [transformValue, valueProp, valueState]);

  const onChange = useCallback(setValue => {
    const onChange = onChangeProp || setValueState;
    onChange(value => {
      let nextValue;
      if (typeof value === 'function') nextValue = setValue(transformValue(value));
      else nextValue = setValue;
      if (specialRowsCount) nextValue = nextValue.splice(0, specialRowsCount);
      if (specialColumnsCount) nextValue = nextValue.map(row => {
        const nextRow = [...row];
        nextRow.splice(0, specialColumnsCount);
        return nextRow;
      });
      return nextValue;
    });
  }, [transformValue, specialRowsCount, specialColumnsCount, onChangeProp, setValueState]);

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

  const groupMapper = useCallback(specialMetaCount => group => ({ start: group.start + specialMetaCount, end: group.end + specialMetaCount }), []);

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
    onColumnsChange,
    onRowsChange,
    totalRows: (totalRows + specialRowsCount) - hiddenRowsIndexes.length,
    totalColumns: (totalColumns + specialColumnsCount) - hiddenColumnsIndexes.length,
    fixRows: fixRows + specialRowsCount,
    fixColumns: fixColumns + specialColumnsCount,
    mergedCells,
    specialRowsCount,
    specialColumnsCount,
    rowsGroups,
    columnsGroups
  };
};

export default useSpreadsheet;