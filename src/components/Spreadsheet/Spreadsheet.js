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
  ...props
}) => {
  const contextValue = useMemo(() => ({
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight
  }), [onRowsChange, onColumnsChange, defaultColumnWidth, defaultRowHeight]);
  return (
    <SpreadsheetContext.Provider
        value={contextValue}>
      <div {...props} style={{ ...style, display: 'inline-block', position: 'relative' }} />
    </SpreadsheetContext.Provider>
  )
};

export const SpreadsheetRow = ({
  ...props
}) => {
  return <ScrollerRow {...props} />
};

const getMergedSize = ({ count, meta = [], startIndex, defaultSize }) => {
  return count && [...new Array(count).keys()].reduce((acc, key, index) => {
    const mergedMeta = meta[startIndex + index];
    const size = (mergedMeta && mergedMeta.size) || defaultSize;
    return acc + size;
  }, 0);
};

export const SpreadsheetMergedCell = ({
  absolute,
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
  let top = 0, left = 0;
  if (absolute) {
    top = rowIndex > 0 ? getMergedSize({ count: rowIndex - 1, meta: rows, startIndex: 0, defaultSize: defaultRowHeight }) : 0;
    left = columnIndex > 0 ? getMergedSize({ count: columnIndex - 1, meta: columns, startIndex: 0, defaultSize: defaultColumnWidth }) : 0;
  };
  const style = { position: 'absolute', top, left, zIndex: 1 };
  const width = getMergedSize({ count: value.colSpan, meta: columns, startIndex: columnIndex, defaultSize: defaultColumnWidth });
  const height = getMergedSize({ count: value.rowSpan, meta: rows, startIndex: rowIndex, defaultSize: defaultRowHeight });
  if (width) style.width = width;
  if (height) style.height = height;
  return <ScrollerCell {...props} style={style}>{children}</ScrollerCell>;
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
  return (
    <ScrollerCell column={column} {...props}>
      {children}
      {value && (value.rowSpan || value.colSpan) && (
        <SpreadsheetMergedCell
            defaultRowHeight={defaultRowHeight}
            defaultColumnWidth={defaultColumnWidth}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
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