import { useMemo } from 'react';

/**
 * @typedef {Object} Meta
 * @property {number} size
 * @property {number} offset
 * @property {'COLUMN_NUMBERS' | 'ROW_NUMBERS'} [type]
 */

/**
 * @typedef {Object} renderOptions
 * @property {number} rowIndex 
 * @property {number} columnIndex
 * @property {import('./useSpreadsheet').Meta} row
 * @property {import('./useSpreadsheet').Meta} column
 */

/**
 * @typedef {Object} useSpreadsheetRenderOptions
 * @property {import('./useSpreadsheet').CellValue[][]} value
 * @property {number[]} visibleRows
 * @property {number[]} visibleColumns
 * @property {Meta[]} rows
 * @property {Meta[]} columns
 * @property {function(renderOptions)} renderIntersectionColumn
 * @property {function(renderOptions)} renderColumnNumber
 * @property {function(renderOptions)} renderRowNumber
 * @property {function(renderOptions)} renderCellValue
 */

/**
 * Renders spreadsheet values
 * @param {useSpreadsheetRenderOptions} options 
 */
const useSpreadsheetRender = ({
  value,
  visibleRows,
  visibleColumns,
  rows,
  columns,
  renderIntersectionColumn,
  renderColumnNumber,
  renderRowNumber,
  renderCellValue
}) => {  
  const elements = useMemo(() => {
    const mergedCells = [];

    return visibleRows.reduce((acc, rowIndex) => {
      const row = rows[rowIndex] || {};
      let columnsElements;
      const rowType = row.type || 'VALUES';

      switch(rowType) {
        case 'COLUMN_NUMBERS':
          columnsElements = visibleColumns.map(columnIndex => {
            const column = columns[columnIndex] || {};
            let columnElement;
            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'ROW_NUMBERS':
                columnElement = renderIntersectionColumn({ row, column, columnIndex });
                break;
              default:
                columnElement = renderColumnNumber({ row, column, columnIndex });
                break;
            }
            return columnElement;
          });
          break;

        case 'VALUES':
          columnsElements = visibleColumns.map(columnIndex => {
            const column = columns[columnIndex] || {};
            const rowValue = value[rowIndex - 1];
            const curValue = rowValue && rowValue[columnIndex - 1];

            // Maintaining merged cells
            if (curValue && (curValue.rowSpan || curValue.colSpan)) {
              for (let i = 0; i < curValue.rowSpan ; i++) {
                for (let j = 0; j < curValue.colSpan ; j++) {
                  const resultRowIndex = rowIndex + i;
                  const resultColumnIndex = columnIndex + j;
                  (i > 0 || j > 0) && mergedCells.push([resultRowIndex, resultColumnIndex]);
                }
              }
            };
            
            let element;
            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'ROW_NUMBERS':
                element = renderRowNumber({ row, column, rowIndex, columnIndex });
                break;
              default:
                const cellIsMerged = mergedCells.some(([row, column]) => row === rowIndex && column === columnIndex);
                element = !cellIsMerged && renderCellValue({ row, rowIndex, column, columnIndex, value: curValue, columns, rows });
                break;
            }
            return element;
          });
          break;
        default:
      }

      return [acc, ...columnsElements];   
    }, [])
  }, [
    rows,
    columns,
    visibleRows,
    visibleColumns,
    value,
    renderIntersectionColumn,
    renderColumnNumber,
    renderRowNumber,
    renderCellValue
  ]);
  return elements;
};

export default useSpreadsheetRender;