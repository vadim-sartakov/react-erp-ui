import { useMemo } from 'react';

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
  totalColumns,
  value,
  rows,
  columns,
  columnNumbersRowHeight,
  rowNumberColumnWidth
}) => {
  const nextRows = useMemo(() => [{ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' }, ...rows], [rows, columnNumbersRowHeight]);
  const nextColumns = useMemo(() => [{ size: rowNumberColumnWidth, type: 'ROW_NUMBER' }, ...columns], [columns, rowNumberColumnWidth]);
  const nextValue = useMemo(() => [new Array(totalColumns).fill(null), ...value].map(rowValue => {
    return [null, ...rowValue];
  }), [value, totalColumns]);
  return {
    rows: nextRows,
    columns: nextColumns,
    value: nextValue
  };
};

export default useSpreadsheet;