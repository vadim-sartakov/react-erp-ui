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
  renderCellValue,
  fixRows,
  fixColumns,
  mergedCells
}) => {
  const cellsElements = useMemo(() => {
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
            const rowValue = value[rowIndex];
            const curValue = rowValue && rowValue[columnIndex];

            const mergedRange = mergedCells && mergedCells.find(mergedRange => {
              return (mergedRange.start.row) === rowIndex &&
                  (mergedRange.start.column) === columnIndex
            });
            
            let element;

            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'ROW_NUMBERS':
                element = renderRowNumber({ row, column, rowIndex, columnIndex });
                break;
              default:
                element = renderCellValue({ row, rowIndex, column, columnIndex, rows, columns, value: curValue, mergedRange });
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
    renderCellValue,
    mergedCells
  ]);

  // Overscrolled merged cells. When merge starts out of visible cells area
  const mergedCellsElements = useMemo(() => {
    // Filtering out merged ranges which are not visible
    const rangeIsOverscrolled = ({ meta, start, end, fixCount }) => {
      return start < meta[fixCount] && end >= meta[fixCount];
    };

    return mergedCells ? mergedCells.filter(mergedRange => {
      return rangeIsOverscrolled({
            meta: visibleRows,
            start: mergedRange.start.row,
            end: mergedRange.end.row,
            fixCount: fixRows
          }) &&
          rangeIsOverscrolled({
            meta: visibleColumns,
            start: mergedRange.start.column,
            end: mergedRange.end.column,
            fixCount: fixColumns
          })
    }).map(mergedRange => {
      const columnIndex = mergedRange.start.column;
      const rowIndex = mergedRange.start.row;
      const rowValue = value[rowIndex];
      const curValue = rowValue && rowValue[columnIndex];
      return renderCellValue({
        rowIndex,
        columnIndex,
        rows,
        columns,
        value: curValue,
        mergedRange,
        overscrolled: true
      });
    }, []) : [];
  }, [
    rows,
    columns,
    fixColumns,
    fixRows,
    visibleRows,
    visibleColumns,
    renderCellValue,
    value,
    mergedCells
  ]);

  return [
    ...cellsElements,
    ...mergedCellsElements
  ];
};

export default useSpreadsheetRender;