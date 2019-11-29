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
 * @typedef {Object} useSpreadsheetOptions
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {number} totalRows
 * @property {number} totalColumns
 * @property {number} rowsPerPage
 * @property {number} columnsPerPage
 * @property {Meta[]} rows
 * @property {Meta[]} columns
 * @property {number} [fixRows=0]
 * @property {number} [fixColumns=0]
 * @property {CellValue[][]} value
 * @property {number} columnNumbersRowHeight
 * @property {number} rowNumberColumnWidth
 */

/**
 * 
 * @param {useSpreadsheetOptions} props 
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
  const columns = [{ size: rowNumberColumnWidth, type: 'ROW_NUMBERS' }, ...(columnsProp || columnsState)];
  const onColumnsChange = onColumnsChangeProp || setColumnsState;

  const spreadsheetContainerProps = {
    defaultColumnWidth,
    defaultRowHeight,
    onColumnsChange,
    onRowsChange
  };

  const scrollerOptions = {
    rows,
    columns,
    totalRows: totalRows + 1,
    totalColumns: totalColumns + 1,
    fixRows: fixRows + 1,
    fixColumns: fixColumns + 1
  };
  return {
    spreadsheetContainerProps,
    scrollerOptions
  };
};

export default useSpreadsheet;