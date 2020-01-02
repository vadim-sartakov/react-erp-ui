import { useMemo } from 'react';
import { getMergedCellSize, getMergedCellPosition } from './utils';

const mergedCellIsInRange = ({ meta, start, end, fixCount }) => {
  return meta.indexOf(start) !== -1 ||
      meta.indexOf(end) !== -1 ||
      (start < meta[fixCount] && end > meta[meta.length - 1]);
}

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
            const rowValue = value[rowIndex - 1];
            const curValue = rowValue && rowValue[columnIndex - 1];
            
            let element;
            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'ROW_NUMBERS':
                element = renderRowNumber({ row, column, rowIndex, columnIndex });
                break;
              default:
                element = renderCellValue({ row, rowIndex, column, columnIndex, value: curValue });
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

  const mergedCellsElements = useMemo(() => {
    // Filtering out merged ranges which are not visible
    return mergedCells ? mergedCells.filter(mergedRange => {
      return mergedCellIsInRange({ meta: visibleRows, start: mergedRange.start.row, end: mergedRange.end.row, fixCount: fixRows }) &&
          mergedCellIsInRange({ meta: visibleColumns, start: mergedRange.start.column, end: mergedRange.end.column, fixCount: fixColumns })
    }).map(mergedRange => {

      const width = value && value.colSpan && getMergedCellSize({
        // Preventing from merging more than fixed range
        count: fixedColumn ? fixColumns - (columnIndex - 1) : value.colSpan,
        meta: columns,
        startIndex: columnIndex,
        defaultSize: defaultColumnWidth
      });
      const height = value && value.rowSpan && getMergedCellSize({
        count: fixedRow ? fixRows - (rowIndex - 1) : value.rowSpan,
        meta: rows,
        startIndex: rowIndex,
        defaultSize: defaultRowHeight
      });

    }, []) : [];
  }, [
    mergedCells
  ]);

  return [
    ...cellsElements,
    ...mergedCellsElements
  ];
};

export default useSpreadsheetRender;