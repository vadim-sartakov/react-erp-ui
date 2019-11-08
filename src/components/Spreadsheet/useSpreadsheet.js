import { useState } from 'react';

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

  const [columnsState, setColumnsState] = useState([]);
  const columns = [{ size: rowNumberColumnWidth, type: 'ROW_NUMBER' }, ...(columnsProp || columnsState)];
  const onColumnsChange = onColumnsChangeProp || setColumnsState;

  const spreadsheetProps = {
    defaultColumnWidth,
    defaultRowHeight,
    onColumnsChange: onColumnsChange,
    onRowsChange: onRowsChange
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
    spreadsheetProps,
    scrollerInputProps
  };
};

export default useSpreadsheet;