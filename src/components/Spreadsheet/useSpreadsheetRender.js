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
  renderRowGroup,
  renderColumnGroup,
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
  specialColumnsCount,
  rowsGroups,
  groupSize,
  columnsGroups
}) => {
  const cellsElements = useMemo(() => {
    return visibleRows.reduce((acc, rowIndex, seqRowIndex) => {
      const row = rows[rowIndex] || {};
      const rowType = row.type;

      const columnsElements = visibleColumns.map((columnIndex, seqColumnIndex) => {
        const column = columns[columnIndex] || {};
        const columnsType = column.type;

        switch(rowType) {
          case 'GROUP':

            switch(columnsType) {
              case 'GROUP':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
              case 'NUMBER':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderColumnGroupButton({ row, column, rowIndex, columnIndex })}</React.Fragment>;
              default:
                const currentLevelGroups = columnsGroups[rowIndex];
                const columnGroup = currentLevelGroups && currentLevelGroups.find(group => group.start === columnIndex);
                const groupMergedRange = columnGroup && {
                  start: {
                    row: rowIndex,
                    column:  columnGroup.start - 1
                  },
                  end: {
                    row: rowIndex,
                    column: columnGroup.end
                  }
                };
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {groupMergedRange ?
                        renderColumnGroup({ row, column, rows, columns, mergedRange: groupMergedRange, columnIndex, defaultColumnWidth, groupSize }) :
                        renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}
                  </React.Fragment>
                );
            }
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowGroupButton({ row, column, rowIndex, columnIndex })}</React.Fragment>;
              case 'NUMBER':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowColumnNumbersIntersection({ row, column, rowIndex, columnIndex })}</React.Fragment>;
              default:
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderColumnNumber({ row, column, columnIndex, key: column.key })}</React.Fragment>;
            }

          default:
            const rowValue = value[rowIndex];
            const curValue = rowValue && rowValue[columnIndex];

            const mergedRange = mergedCells && mergedCells.find(mergedRange => {
              return (mergedRange.start.row) === rowIndex &&
                  (mergedRange.start.column) === columnIndex
            });
            
            switch(columnsType) {
              case 'GROUP':
                const currentLevelGroups = rowsGroups[columnIndex];
                const rowGroup = currentLevelGroups && currentLevelGroups.find(group => (group.start - 1) === rowIndex);
                const groupMergedRange = rowGroup && {
                  start: {
                    row: rowGroup.start - 1,
                    column: columnIndex
                  },
                  end: {
                    row: rowGroup.collapsed ? rowGroup.start - 1 : rowGroup.end,
                    column: columnIndex
                  }
                };
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {groupMergedRange ?
                        renderRowGroup({ row, column, rows, columns, mergedRange: groupMergedRange, rowIndex, defaultRowHeight, groupSize, collapsed: rowGroup.collapsed }) :
                        renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}
                  </React.Fragment>
                );
              case 'NUMBER':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderRowNumber({ row, column, rowIndex, key: row.key, columnIndex })}</React.Fragment>;
              default:
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderCellValue({ row, rowIndex, column, columnIndex, rows, columns, value: curValue, mergedRange })}</React.Fragment>;
            }
        }

      });

      return [acc, ...columnsElements];   
    }, [])
  }, [
    groupSize,
    defaultColumnWidth,
    defaultRowHeight,
    rows,
    columns,
    visibleRows,
    visibleColumns,
    value,
    renderGroupEmptyArea,
    renderRowGroupButton,
    renderColumnGroupButton,
    renderRowGroup,
    renderColumnGroup,
    renderRowColumnNumbersIntersection,
    renderColumnNumber,
    renderRowNumber,
    renderCellValue,
    mergedCells,
    rowsGroups,
    columnsGroups
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