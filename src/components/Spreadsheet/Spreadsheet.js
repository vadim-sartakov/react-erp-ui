import React, { createContext, useContext, useCallback } from 'react';
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
  return (
    <SpreadsheetContext.Provider
        value={{
          rows,
          onRowsChange,
          columns,
          onColumnsChange,
          defaultColumnWidth,
          defaultRowHeight
        }}>
      <div {...props} style={{ ...style, display: 'inline-block', position: 'relative' }} />
    </SpreadsheetContext.Provider>
  )
};

export const SpreadsheetRow = ({
  index,
  ...props
}) => {
  return <ScrollerRow index={index} {...props} />
};

export const SpreadsheetCell = ({
  index,
  ...props
}) => {
  return <ScrollerCell index={index} {...props} />;
};

export const SpreadsheetColumnResizer = ({ index, ...props }) => {
  const { columns, onColumnsChange, defaultColumnWidth } = useContext(SpreadsheetContext);
  const column = columns[index];
  const sizes = { width: (column && column.size) || defaultColumnWidth, height: 0 };
  const handleSizesChange = useCallback(({ width }) => {
    onColumnsChange(columns => {
      const nextColumns = [...(columns || [])];
      nextColumns[index] = { ...nextColumns[index], size: width };
      return nextColumns;
    });
  }, [index, onColumnsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};

export const SpreadsheetRowResizer = ({ index, ...props }) => {
  const { rows, onRowsChange, defaultRowHeight } = useContext(SpreadsheetContext);
  const row = rows[index];
  const sizes = { height: (row && row.size) || defaultRowHeight, width: 0 };
  const handleSizesChange = useCallback(({ height }) => {
    onRowsChange(rows => {
      const nextRows = [...(rows || [])];
      nextRows[index] = { ...nextRows[index], size: height };
      return nextRows;
    });
  }, [index, onRowsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};