/**
 * @module components/Spreadsheet
 */

/**
 * @typedef Meta
 * @property {number} [size] 
 * @property {boolean} [hidden] 
 */

/**
 * @typedef {Object} useSpreadsheetOptions
 * @property {Meta[]} rows
 * @property {Meta[]} columns
 * @property {function} onRowsChange
 * @property {function} onColumnsChange
 * @property {number} columnNumbersRowHeight
 * @property {number} rowNumberColumnWidth
 * @property {number} columnGroupHeight
 * @property {number} rowGroupWidth
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {number} totalRows
 * @property {number} totalColumns
 * @property {number} rowsPerPage
 * @property {number} columnsPerPage
 * @property {number} [fixRows=0]
 * @property {number} [fixColumns=0]
 * 
 * @property {Object[][]} value
 * @property {Object} value.value
 * @property {function(*):string} value.format
 * @property {string} value.formula
 * 
 */