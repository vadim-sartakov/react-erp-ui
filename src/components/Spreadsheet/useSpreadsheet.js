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
  rows = [],
  columns: columnsProp = [],
  onColumnsChange: onColumnsChangeProp,
  columnNumbersRowHeight,
  rowNumberColumnWidth,
  totalRows,
  totalColumns,
  loadRowsPage,
  defaultColumnWidth,
  defaultRowHeight,
  async,
  fixRows = 0,
  fixColumns = 0
}) => {

  const [columnsState, setColumnsState] = useState(columnsProp);
  const columns = columnsProp || columnsState;
  const onColumnsChange = onColumnsChangeProp || setColumnsState;

  const handleColumnsChange = columns => {
    // Removing prepended values
    const nextColumns = columns.filter(column => !column.type);
    onColumnsChange(nextColumns);
  };

  const nextRows = useMemo(() => [{ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' }, ...rows], [rows, columnNumbersRowHeight]);
  const nextColumns = useMemo(() => [{ size: rowNumberColumnWidth, type: 'ROW_NUMBER' }, ...columns], [columns, rowNumberColumnWidth]);

  /*const nextLoadRowsPage = (page, itemsPerPage) => {
    const prependSpecialValues = value => {
      return [new Array(totalColumns).fill(null), ...value].map(rowValue => {
        return [null, ...rowValue];
      })
    };
    if (async) {
      return loadRowsPage(page, itemsPerPage).then(value => prependSpecialValues(value));
    } else {
      const value = loadRowsPage(page, itemsPerPage);
      return prependSpecialValues(value);
    }
  };*/

  const spreadsheetProps = {
    defaultColumnWidth,
    defaultRowHeight,
    rows: nextRows,
    columns: nextColumns,
    onColumnsChange: handleColumnsChange
  };

  const scrollerInputProps = {
    rows: nextRows,
    columns : nextColumns,
    totalRows: totalRows + 1,
    totalColumns: totalColumns + 1,
    fixRows: fixRows + 1,
    fixColumns: fixColumns + 1/*,
    loadRowsPage: nextLoadRowsPage*/
  };
  return {
    spreadsheetProps,
    scrollerInputProps
  };
};

export default useSpreadsheet;