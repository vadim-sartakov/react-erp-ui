import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { ScrollerRow, ScrollerCell } from '../Scroller'
import { useResize } from '../useResize';

const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  style,
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
      <div {...props} style={{ ...style, display: 'inline-grid', position: 'relative' }} />
    </SpreadsheetContext.Provider>
  )
};

export const SpreadsheetRow = ({
  style,
  ...props
}) => {
  const nextStyle = { ...style };
  return <ScrollerRow {...props} style={nextStyle} />
};

const getMergedSize = ({ count, meta = [], startIndex, defaultSize }) => {
  return count && [...new Array(count).keys()].reduce((acc, key, index) => {
    const mergedMeta = meta[startIndex + index];
    const size = (mergedMeta && mergedMeta.size) || defaultSize;
    return acc + size;
  }, 0);
};

export const SpreadsheetMergedCell = ({
  fixRows,
  fixColumns,
  defaultRowHeight,
  defaultColumnWidth,
  rowIndex,
  columnIndex,
  rows,
  columns,
  value,
  children,
  ...props
}) => {

  const fixedRow = rowIndex <= fixRows;
  const fixedColumn = columnIndex <= fixColumns;

  const elementStyle = { position: 'absolute', top: 0, left: 0 };

  const width = getMergedSize({
    // Preventing from merging more than fixed range
    count: fixedColumn ? fixColumns - (columnIndex - 1) : value.colSpan,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = getMergedSize({
    count: fixedRow ? fixRows - (rowIndex - 1) : value.rowSpan,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });
  if (width) elementStyle.width = width;
  if (height) elementStyle.height = height;
  return <div {...props} style={elementStyle}>{children}</div>;
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
  children,
  ...props
}) => {
  const { fixRows, fixColumns } = useContext(SpreadsheetContext);

  let rootStyle = {};
  if (value && (value.rowSpan || value.colSpan)) {
    const fixedRow = rowIndex <= fixRows;
    const fixedColumn = columnIndex <= fixColumns;
    if (fixedRow && fixedColumn) rootStyle.zIndex = 7;
    else if (fixedRow) rootStyle.zIndex = 5;
    else if (fixedColumn) rootStyle.zIndex = 3;
    else rootStyle.zIndex = 1;
  }

  const mergeCell = value && (value.rowSpan || value.colSpan);

  return (
    <ScrollerCell column={column} {...props} style={rootStyle}>
      {!mergeCell && children}
      {mergeCell && (
        <SpreadsheetMergedCell
            fixRows={fixRows}
            fixColumns={fixColumns}
            defaultRowHeight={defaultRowHeight}
            defaultColumnWidth={defaultColumnWidth}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            rows={rows}
            columns={columns}
            value={value}
            {...props}>
          {children}
        </SpreadsheetMergedCell>
      )}
    </ScrollerCell>
  );
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