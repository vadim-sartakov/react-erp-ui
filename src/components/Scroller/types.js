/**
 * @module components/Scroller
 */

/**
 * @typedef {Object} Meta
 * @property {number} size
 * @property {number} offset - Offset for sticky positioning
 */

/**
  * Render Cell callback. Could be memorized to prevent unnecessary calculations.
  * @callback renderCell
  * @param {Meta} row
  * @param {Meta} column
  * @param {*} value
  */

/**
 * Async callback for loading page
 * @callback loadPage
 * @param {number} page
 * @param {number} itemsPerPage
 */

/**
 * @typedef {Object} useScrollerOptions
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {number} totalRows
 * @property {number} [totalColumns]
 * @property {number} rowsPerPage
 * @property {number} columnsPerPage
 * @property {Meta[]} [rows]
 * @property {Meta[]} [columns]
 * @property {Object[][]} [value] - Sync value
 * @property {boolean} [lazy] - When set to true whe height of scroller will expand on demand
 * @property {loadPage} loadPage - Load async page callback
 * @property {renderCell} renderCell - Render scroller cell callback. Should be memorized.
 * @property {number} [fixRows=0]
 * @property {number} [fixColumns=0]
 */

/**
 * @typedef {Object} useScrollerResult
 * @property {Object[][]} loadedValues - Values loaded asynchronously. Applicable only for 'async' mode
 * when 'loadPage' callback specified
 * @property {number} rowsStartIndex
 * @property {number} columnsStartIndex
 * @property {ScrollerContainerProps} scrollerContainerProps
 */

 /**
 * @typedef {Object} ScrollerContainerProps
 * @property {number} [width]
 * @property {number} height
 * @property {Object} coverProps
 * @property {Object} pagesProps
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {function} onScroll
 * @property {*} coverStyles
 * @property {*} pagesStyles
 */

/**
 * @typedef {Object} ScrollerCellProps
 * @property {*} [Component] - React Component
 * @property {Meta} row
 * @property {Meta} column
 */

/**
 * @typedef {useScrollerOptions | ScrollerContainerProps} ScrollerProps
 */