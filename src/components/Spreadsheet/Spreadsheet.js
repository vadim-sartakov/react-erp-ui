import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { ScrollerCell } from '../Scroller'
import { useResize } from '../useResize';

const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  rows,
  onRowsChange,
  columns,
  onColumnsChange,
  defaultColumnWidth,
  defaultRowHeight,
  fixRows,
  fixColumns,
  ...props
}) => {
  const contextValue = useMemo(() => ({
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    fixRows,
    fixColumns
  }), [onRowsChange, onColumnsChange, defaultColumnWidth, defaultRowHeight, fixRows, fixColumns]);
  return (
    <SpreadsheetContext.Provider
        value={contextValue}>
      <div {...props} />
    </SpreadsheetContext.Provider>
  )
};

const getMergedSize = ({ count, meta = [], startIndex, defaultSize }) => {
  return count && [...new Array(count).keys()].reduce((acc, key, index) => {
    const mergedMeta = meta[startIndex + index];
    const size = (mergedMeta && mergedMeta.size) || defaultSize;
    return acc + size;
  }, 0);
};

export const SpreadsheetCell = ({
  defaultRowHeight,
  defaultColumnWidth,
  rowIndex,
  columnIndex,
  column,
  row,
  rows,
  columns,
  value,
  ...props
}) => {
  const { fixRows, fixColumns } = useContext(SpreadsheetContext);

  const fixedRow = rowIndex <= fixRows;
  const fixedColumn = columnIndex <= fixColumns;

  const width = value && value.colSpan && getMergedSize({
    // Preventing from merging more than fixed range
    count: fixedColumn ? fixColumns - (columnIndex - 1) : value.colSpan,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = value && value.rowSpan && getMergedSize({
    count: fixedRow ? fixRows - (rowIndex - 1) : value.rowSpan,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });

  const nextStyle = { width, height };
  if (value && value.colSpan) nextStyle.gridColumn = `span ${value.colSpan}`;
  if (value && value.rowSpan) nextStyle.gridRow = `span ${value.rowSpan}`;

  return <ScrollerCell row={row} column={column} {...props} style={nextStyle} />;
};

export const SpreadsheetColumnResizer = ({ index, column, ...props }) => {
  const { onColumnsChange, defaultColumnWidth } = useContext(SpreadsheetContext);
  const sizes = { width: (column && column.size) || defaultColumnWidth, height: 0 };
  const handleSizesChange = useCallback(({ width }) => {
    onColumnsChange(columns => {
      const nextColumns = [...(columns || [])];
      nextColumns[index - 1] = { ...nextColumns[index - 1], size: width };
      return nextColumns;
    });
  }, [index, onColumnsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};

export const SpreadsheetRowResizer = ({ index, row, ...props }) => {
  const { onRowsChange, defaultRowHeight } = useContext(SpreadsheetContext);
  const sizes = { height: (row && row.size) || defaultRowHeight, width: 0 };
  const handleSizesChange = useCallback(({ height }) => {
    onRowsChange(rows => {
      const nextRows = [...(rows || [])];
      nextRows[index - 1] = { ...nextRows[index - 1], size: height };
      return nextRows;
    });
  }, [index, onRowsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};