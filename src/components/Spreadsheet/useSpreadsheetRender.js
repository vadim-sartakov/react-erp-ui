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
  mergedCells,
  defaultColumnWidth,
  defaultRowHeight
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
            // TODO: instead of static '1' here should be some variable
            // holding special rows and columns count
            // it would be row/column numbers and groups
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
      const width = getMergedCellSize({
        count: mergedRange.end.column - mergedRange.start.column,
        meta: columns,
        startIndex: mergedRange.start.column,
        defaultSize: defaultColumnWidth
      });
      const height = getMergedCellSize({
        count: mergedRange.end.row - mergedRange.start.row,
        meta: rows,
        startIndex: mergedRange.start.row,
        defaultSize: defaultRowHeight
      });
      
      const top = getMergedCellPosition({
        meta: rows,
        index: mergedRange.start.row,
        defaultSize: defaultRowHeight
      });
      const left = getMergedCellPosition({
        meta: columns,
        index: mergedRange.start.column,
        defaultSize: defaultColumnWidth
      });

      const style = {
        position: 'absolute',
        top,
        left,
        width,
        height
      };

      const columnIndex = mergedRange.start.column;
      const rowIndex = mergedRange.start.row;

      // TODO: replace '1' const with variable too
      const rowValue = value[rowIndex - 1];
      const curValue = rowValue && rowValue[columnIndex - 1];

      return renderCellValue({
        columnIndex,
        rowIndex,
        row: rows[rowIndex],
        column: columns[columnIndex],
        value: curValue,
        style
      });
    }, []) : [];
  }, [
    rows,
    columns,
    defaultColumnWidth,
    defaultRowHeight,
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