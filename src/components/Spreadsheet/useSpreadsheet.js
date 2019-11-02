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
  value,
  rows,
  columns,
  columnNumbersRowHeight,
  rowNumberColumnWidth
}) => {
  const nextRows = useMemo(() => [{ size: columnNumbersRowHeight }, ...rows], [rows, columnNumbersRowHeight]);
  const nextColumns = useMemo(() => [{ size: rowNumberColumnWidth }, ...columns], [columns, rowNumberColumnWidth]);
  const nextValue = useMemo(() => [[], ...value].map(rowValue => {
    return [undefined, ...rowValue];
  }), [value]);
  return {
    rows: nextRows,
    columns: nextColumns,
    value: nextValue
  };
};

export default useSpreadsheet;