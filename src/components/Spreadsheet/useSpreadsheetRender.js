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
  renderRowGroupButton,
  renderColumnGroupButton,
  renderGroupEmptyArea,
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
  mergedCells,
  specialRowsCount,
  specialColumnsCount
}) => {
  const cellsElements = useMemo(() => {
    return visibleRows.reduce((acc, rowIndex, seqRowIndex) => {
      const row = rows[rowIndex] || {};
      let columnsElements;
      const rowType = row.type || 'VALUES';

      switch(rowType) {
        case 'GROUP':
          columnsElements = visibleColumns.map((columnIndex, seqColumnIndex) => {
            const column = columns[columnIndex] || {};
            let columnElement;
            const columnsType = column.type;
            switch(columnsType) {
              case 'GROUP':
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              case 'ROW_NUMBERS':
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderColumnGroupButton({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              default:
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
            }
            return columnElement;
          });
          break;
        case 'COLUMN_NUMBERS':
          columnsElements = visibleColumns.map((columnIndex, seqColumnIndex) => {
            const column = columns[columnIndex] || {};
            let columnElement;
            const columnsType = column.type || 'VALUES';
            switch(columnsType) {
              case 'GROUP':
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowGroupButton({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              case 'ROW_NUMBERS':
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowColumnNumbersIntersection({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              default:
                columnElement = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderColumnNumber({ row, column, columnIndex })}</React.Fragment>;
                break;
            }
            return columnElement;
          });
          break;

        case 'VALUES':
          columnsElements = visibleColumns.map((columnIndex, seqColumnIndex) => {
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
              case 'GROUP':
                element = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              case 'ROW_NUMBERS':
                element = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowNumber({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                break;
              default:
                element = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderCellValue({ row, rowIndex, column, columnIndex, rows, columns, value: curValue, mergedRange })}</React.Fragment>;
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
    renderGroupEmptyArea,
    renderRowGroupButton,
    renderColumnGroupButton,
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
      return (
        <React.Fragment key={`merged_${rowIndex}_${columnIndex}`}>
          {renderCellValue({
            rowIndex,
            columnIndex,
            rows,
            columns,
            value: curValue,
            mergedRange,
            overscrolled: true
          })}
        </React.Fragment>
      );
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

    const containerStyle = {
      position: 'absolute',
      height: '100%',
      width: '100%',
      pointerEvents: 'none',
      zIndex: 10
    };

    const baseFixedAreaStyle = {
      position: 'sticky',
      top: 0,
      left: 0,
    };

    if ((fixColumns - specialColumnsCount) && renderColumnsFixedArea) {
      const width = getCellsRangeSize({
        startIndex: 0,
        count: fixColumns,
        defaultSize: defaultColumnWidth,
        meta: columns
      });
      const style = {
        ...baseFixedAreaStyle,
        width,
        height: '100%'
      };
      result.push((
        <div key="fixed_columns" style={containerStyle}>
          {renderColumnsFixedArea({ style })}
        </div>
      ));
    }

    if ((fixRows - specialRowsCount) && renderRowsFixedArea) {
      const height = getCellsRangeSize({
        startIndex: 0,
        count: fixRows,
        defaultSize: defaultRowHeight,
        meta: rows
      });
      const style = {
        ...baseFixedAreaStyle,
        width: '100%',
        height
      };
      result.push((
        <div key="fixed_rows" style={containerStyle}>
          {renderRowsFixedArea({ style })}
        </div>
      ));
    }

    return result;
  }, [
    fixColumns,
    fixRows,
    renderColumnsFixedArea,
    renderRowsFixedArea,
    columns,
    rows,
    defaultColumnWidth,
    defaultRowHeight,
    specialColumnsCount,
    specialRowsCount
  ]);

  return [
    ...cellsElements,
    ...mergedCellsElements,
    ...fixedAreasElements
  ];
};

export default useSpreadsheetRender;