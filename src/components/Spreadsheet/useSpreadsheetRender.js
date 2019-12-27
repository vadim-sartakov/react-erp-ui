import { useMemo } from 'react';

/**
 * @param {import('./').useSpreadsheetRenderOptions} options
 * @returns {import('./').useSpreadsheetResult}
 */
const useSpreadsheetRender = ({
  value,
  visibleRows,
  visibleColumns,
  rows,
  columns,
  renderRowColumnNumbersIntersection,
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
                columnElement = renderRowColumnNumbersIntersection({ row, column, columnIndex });
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
    renderRowColumnNumbersIntersection,
    renderColumnNumber,
    renderRowNumber,
    renderCellValue
  ]);
  return elements;
};

export default useSpreadsheetRender;