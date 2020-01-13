import { useState, useMemo, useCallback } from 'react';
import { getGroups } from './utils';

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

  const transformRows = useCallback(rows => {
    const result = [];
    const groups = getGroups(columns);
    groups.length && [...new Array(groups.length + 1).keys()].forEach(group => result.push({ size: groupSize, type: 'GROUP' }));
    if (!hideRowColumnNumbers) result.push({ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' });
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
    if (!hideRowColumnNumbers) result.push({ size: rowNumberColumnWidth, type: 'ROW_NUMBERS' });
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

  return {
    value,
    onChange,
    rows: nextRows,
    columns: nextColumns,
    onColumnsChange,
    onRowsChange,
    totalRows: totalRows + specialRowsCount,
    totalColumns: totalColumns + specialColumnsCount,
    fixRows: fixRows + specialRowsCount,
    fixColumns: fixColumns + specialColumnsCount,
    mergedCells,
    specialRowsCount,
    specialColumnsCount
  };
};

export default useSpreadsheet;