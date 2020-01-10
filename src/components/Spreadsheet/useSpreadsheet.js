import { useState, useMemo, useCallback } from 'react';

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
  mergedCells: mergedCellsProp
}) => {
  const specialRowsCount = useMemo(() => hideRowColumnNumbers ? 0 : 1, [hideRowColumnNumbers]);
  const specialColumnsCount = useMemo(() => hideRowColumnNumbers ? 0 : 1, [hideRowColumnNumbers]);

  const transformValue = useCallback(value => {
    let result = value;
    if (specialRowsCount) result = [...new Array(specialRowsCount), ...value];
    if (specialColumnsCount) result = result.map(row => [...new Array(specialColumnsCount), ...(row || [])]);
    return result;
  }, [specialRowsCount, specialColumnsCount]);

  const transformRows = useCallback(rows => {
    const result = [];
    if (!hideRowColumnNumbers) result.push({ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' });
    result.push(...(rows || []));
    return result;
  }, [columnNumbersRowHeight, hideRowColumnNumbers]);

  const transformColumns = useCallback(columns => {
    const result = [];
    if (!hideRowColumnNumbers) result.push({ size: rowNumberColumnWidth, type: 'ROW_NUMBERS' });
    result.push(...(columns || []));
    return result;
  }, [rowNumberColumnWidth, hideRowColumnNumbers]);

  const [valueState, setValueState] = useState([]);
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

  const [rowsState, setRowsState] = useState([]);
  const rows = useMemo(() => transformRows(rowsProp || rowsState), [rowsProp, rowsState, transformRows]);
  const onRowsChange = useCallback(setRows => {
    const onRowsChange = onRowsChangeProp || setRowsState;
    onRowsChange(rows => {
      let nextRows;
      if (typeof setRows === 'function') nextRows = setRows(transformRows(rows));
      else nextRows = setRows;
      nextRows = [...nextRows];
      nextRows.splice(0, specialRowsCount);
      return nextRows;
    });
  }, [onRowsChangeProp, setRowsState, specialRowsCount, transformRows]);

  const [columnsState, setColumnsState] = useState([]);
  const columns = useMemo(() => transformColumns((columnsProp || columnsState)), [transformColumns, columnsProp, columnsState]);
  const onColumnsChange = useCallback(setColumns => {
    const onColumnsChange = onColumnsChangeProp || setColumnsState;
    onColumnsChange(columns => {
      let nextColumns;
      if (typeof setColumns === 'function') nextColumns = setColumns(transformColumns(columns));
      else nextColumns = setColumns;
      nextColumns = [...nextColumns];
      nextColumns.splice(0, specialColumnsCount);
      return nextColumns;
    });
  }, [onColumnsChangeProp, specialColumnsCount, transformColumns]);

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
    rows,
    columns,
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