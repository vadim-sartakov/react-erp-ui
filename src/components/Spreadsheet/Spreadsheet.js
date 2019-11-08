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

export const SpreadsheetCell = ({
  column,
  row,
  rows,
  columns,
  rowSpan,
  colSpan,
  ...props
}) => {
  let mergeCell, nextColumn;
  if (rowSpan || colSpan) {

  }
  return (
    <>
      <ScrollerCell column={column} {...props} />
    </>
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