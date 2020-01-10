import React, { useMemo, useCallback } from 'react';
import { getCellsRangeSize } from './utils';

/**
 * @param {import('./').UseSpreadsheetRenderOptions} options
 * @returns {import('./').UseSpreadsheetResult}
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
  renderColumnsFixedArea,
  renderRowsFixedArea,
  fixRows,
  fixColumns,
  defaultRowHeight,
  defaultColumnWidth,
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

  const overscrolledFilter = useCallback(mergedRange => {
    const result =
        (mergedRange.start.row > fixRows && mergedRange.start.row < visibleRows[fixRows] && mergedRange.end.row >= visibleRows[fixRows]) ||
        (mergedRange.start.column > fixColumns && mergedRange.start.column < visibleColumns[fixColumns] && mergedRange.end.column >= visibleColumns[fixColumns]);
    return result;
  }, [visibleRows, visibleColumns, fixRows, fixColumns]);

  // Overscrolled merged cells. When merge starts out of visible cells area
  const mergedCellsElements = useMemo(() => {
    // Filtering out merged ranges which are not visible
    return mergedCells ? mergedCells.filter(overscrolledFilter).map(mergedRange => {
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
    renderCellValue,
    value,
    mergedCells,
    overscrolledFilter
  ]);

  const fixedAreasElements = useMemo(() => {
    const result = [];
    const columnNumbersMetaIndex = rows.findIndex(row => row.type === 'COLUMN_NUMBERS');
    const rowNumbersMetaIndex = columns.findIndex(column => column.type === 'ROW_NUMBERS');

    const columnNumbersMeta = rows[columnNumbersMetaIndex];
    const rowNumbersMeta = columns[rowNumbersMetaIndex];

    const topOffset = (columnNumbersMeta && columnNumbersMeta.offset) || 0;
    const leftOffset = (rowNumbersMeta && rowNumbersMeta.offset) || 0;

    const containerStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      height: `calc(100% - ${topOffset}px)`,
      width: `calc(100% - ${leftOffset}px)`,
      pointerEvents: 'none',
      zIndex: 10
    };

    const baseFixedAreaStyle = {
      position: 'sticky',
      top: topOffset,
      left: leftOffset,
    };

    if (fixColumns && renderColumnsFixedArea) {
      const width = getCellsRangeSize({ startIndex: columnNumbersMetaIndex, count: fixColumns, defaultSize: defaultColumnWidth, meta: columns });
      const style = {
        ...baseFixedAreaStyle,
        width,
        height: `calc(100% - ${topOffset}px)`
      };
      result.push((
        <div key="fixed_columns" style={containerStyle}>
          {renderColumnsFixedArea({ style })}
        </div>
      ));
    }

    if (fixRows && renderRowsFixedArea) {
      const height = getCellsRangeSize({ startIndex: rowNumbersMetaIndex, count: fixRows, defaultSize: defaultRowHeight, meta: rows });
      const style = {
        ...baseFixedAreaStyle,
        width: `calc(100% - ${leftOffset}px)`,
        height
      };
      result.push((
        <div key="fixed_rows" style={containerStyle}>
          {renderRowsFixedArea({ style })}
        </div>
      ));
    }

    return result;
  }, [fixColumns, fixRows, renderColumnsFixedArea, renderRowsFixedArea, columns, rows, defaultColumnWidth, defaultRowHeight]);

  return [
    ...cellsElements,
    ...mergedCellsElements,
    ...fixedAreasElements
  ];
};

export default useSpreadsheetRender;