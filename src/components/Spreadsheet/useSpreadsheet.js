import { useState, useMemo } from 'react';

/**
 * @typedef {Object} Meta
 * @property {number} [size] 
 * @property {boolean} [hidden] 
 * @property {number} [boolean] 
 */

/**
 * @callback formatCallback
 * @param {*} value
 * @return {*}
 * 
 * @typedef {Object} CellValue
 * @property {*} value
 * @property {formatCallback} [format]
 * @property {string} [formula]
 */

/**
 * @typedef {Object} useSpreadsheetProps
 * @property {CellValue[][]} value
 * @property {Meta[]} rows
 * @property {Meta[]} columns
 * @property {number} columnNumbersRowHeight
 * @property {number} rowNumberColumnWidth
 */

/**
 * 
 * @param {useSpreadsheetProps} props 
 */
const useSpreadsheet = ({
  rows: rowsProps,
  onRowsChange: onRowsChangeProp,
  columns: columnsProp,
  onColumnsChange: onColumnsChangeProp,
  columnNumbersRowHeight,
  rowNumberColumnWidth,
  totalRows,
  totalColumns,
  defaultColumnWidth,
  defaultRowHeight,
  fixRows = 0,
  fixColumns = 0
}) => {

  const [rowsState, setRowsState] = useState([]);
  const rows = [{ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' }, ...(rowsProps || rowsState)];
  const onRowsChange = onRowsChangeProp || setRowsState;

  const handleRowsChange = rowsSetter => {
    const nextRows = [...rowsSetter(rows)];
    nextRows.shift();
    onRowsChange(nextRows);
  };

  const [columnsState, setColumnsState] = useState([]);
  const columns = [{ size: rowNumberColumnWidth, type: 'ROW_NUMBER' }, ...(columnsProp || columnsState)];
  const onColumnsChange = onColumnsChangeProp || setColumnsState;

  const handleColumnsChange = columnsSetter => {
    const nextColumns = [...columnsSetter(columns)];
    nextColumns.shift();
    onColumnsChange(nextColumns);
  };

  const spreadsheetProps = {
    defaultColumnWidth,
    defaultRowHeight,
    rows,
    columns,
    onColumnsChange: handleColumnsChange,
    onRowsChange: handleRowsChange
  };

  const scrollerInputProps = {
    rows,
    columns,
    totalRows: totalRows + 1,
    totalColumns: totalColumns + 1,
    fixRows: fixRows + 1,
    fixColumns: fixColumns + 1
  };
  return {
    rows,
    columns,
    spreadsheetProps,
    scrollerInputProps
  };
};

export default useSpreadsheet;