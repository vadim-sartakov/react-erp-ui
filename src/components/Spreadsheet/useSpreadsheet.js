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
 * @property {number} fixRows 
 * @property {number} fixColumns
 * @property {Meta[]} rows
 * @property {Meta[]} columns
 */

/**
 * 
 * @param {useSpreadsheetProps} props 
 */
const useSpreadsheet = ({
  value,
  rows,
  columns,
  fixRows,
  fixColumns
}) => {
  return {

  };
};

export default useSpreadsheet;