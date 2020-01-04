import React, { useMemo } from 'react';
import { getMergedCellSize, getMergedCellPosition } from './utils';

const mergedCellIsInRange = ({ meta, start, end, fixCount }) => {
  return meta.indexOf(start) !== -1 ||
      meta.indexOf(end) !== -1 ||
      (start < meta[fixCount] && end > meta[meta.length - 1]);
};

const getMergedCellProps = ({
  mergedRange,
  specialRowsCount,
  specialColumnsCount,
  rows,
  columns,
  defaultRowHeight,
  defaultColumnWidth,
  fixRows,
  fixColumns
}) => {
  const columnIndex = mergedRange.start.column + specialColumnsCount;
  const rowIndex = mergedRange.start.row + specialRowsCount;
  
  const top = getMergedCellPosition({
    meta: rows,
    index: rowIndex,
    defaultSize: defaultRowHeight
  });
  const left = getMergedCellPosition({
    meta: columns,
    index: columnIndex,
    defaultSize: defaultColumnWidth
  });

  const width = getMergedCellSize({
    count: mergedRange.end.column - mergedRange.start.column,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = getMergedCellSize({
    count: mergedRange.end.row - mergedRange.start.row,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });

  const fixWidth = fixColumns && columnIndex <= fixColumns && getMergedCellSize({
    count: fixColumns - mergedRange.start.column,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });

  const fixHeight = fixRows && rowIndex <= fixRows && getMergedCellSize({
    count: fixRows - mergedRange.start.row,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });

  return {
    rowIndex,
    columnIndex,
    top,
    left,
    width,
    height,
    fixWidth,
    fixHeight
  }
};

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
  defaultRowHeight,
  specialRowsCount = 1,
  specialColumnsCount = 1
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
            const rowValue = value[rowIndex - specialRowsCount];
            const curValue = rowValue && rowValue[columnIndex - specialRowsCount];

            const isFixedColumnArea = columnIndex <= fixColumns;
            const isFixedRowArea = rowIndex <= fixRows;
            const mergedRange = mergedCells && mergedCells.find(mergedRange => {
              return (mergedRange.start.row + specialRowsCount) === rowIndex &&
                  (mergedRange.start.column + specialColumnsCount) === columnIndex
            });
            const shouldRenderMerged = (isFixedColumnArea || isFixedRowArea) && mergedRange;
            
            let element;

            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'ROW_NUMBERS':
                element = renderRowNumber({ row, column, rowIndex, columnIndex });
                break;
              default:

                let children;
                if (shouldRenderMerged) {
                  const {
                    width,
                    height,
                    fixWidth,
                    fixHeight
                  } = getMergedCellProps({
                    mergedRange,
                    specialRowsCount,
                    specialColumnsCount,
                    rows,
                    columns,
                    defaultRowHeight,
                    defaultColumnWidth,
                    fixRows,
                    fixColumns
                  });

                  const containerStyle = {
                    position: 'absolute',
                    overflow: 'hidden',
                    width: fixWidth,
                    height,
                    top: 0,
                    left: 0
                  };
    
                  const valueStyle = {
                    width,
                    height
                  };
                  children = (
                    <div key={`${rowIndex}_${columnIndex}`} style={containerStyle}>
                      {renderCellValue({ rowIndex, columnIndex, row, column, value: curValue, style: valueStyle })}
                    </div>
                  );
                }
                element = renderCellValue({ row, rowIndex, column, columnIndex, value: curValue, children });
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
    specialRowsCount,
    specialColumnsCount,
    fixRows,
    fixColumns,
    defaultColumnWidth,
    defaultRowHeight,
    mergedCells
  ]);

  const mergedCellsElements = useMemo(() => {
    // Filtering out merged ranges which are not visible
    return mergedCells ? mergedCells.filter(mergedRange => {
      return mergedCellIsInRange({
            meta: visibleRows,
            start: mergedRange.start.row + specialRowsCount,
            end: mergedRange.end.row + specialRowsCount,
            fixCount: fixRows
          }) &&
          mergedCellIsInRange({
            meta: visibleColumns,
            start: mergedRange.start.column + specialColumnsCount,
            end: mergedRange.end.column + specialColumnsCount,
            fixCount: fixColumns
          })
    }).map(mergedRange => {
      const {
        rowIndex,
        columnIndex,
        top,
        left,
        width,
        height
      } = getMergedCellProps({
        mergedRange,
        specialRowsCount,
        specialColumnsCount,
        rows,
        columns,
        defaultRowHeight,
        defaultColumnWidth
      });

      const style = {
        position: 'absolute',
        top,
        left,
        width,
        height
      };

      const rowValue = value[rowIndex - specialRowsCount];
      const curValue = rowValue && rowValue[columnIndex - specialColumnsCount];

      return renderCellValue({
        columnIndex,
        rowIndex,
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
    mergedCells,
    specialColumnsCount,
    specialRowsCount
  ]);

  return [
    ...cellsElements,
    ...mergedCellsElements
  ];
};

export default useSpreadsheetRender;