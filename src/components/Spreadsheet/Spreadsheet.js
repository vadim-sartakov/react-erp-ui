import React, { createContext, useContext, useCallback } from 'react';
import { ScrollerRow, ScrollerCell } from '../Scroller'
import { useResize } from '../useResize';

const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  style,
  value,
  onValueChange,
  rows,
  onRowsChange,
  columns,
  onColumnsChange,
  ...props
}) => {
  return (
    <SpreadsheetContext.Provider
        value={{
          value,
          onValueChange,
          rows,
          onRowsChange,
          columns,
          onColumnsChange
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
      return columns.map((column, curIndex) => curIndex === index ? { ...column, size: width } : column);
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
      return rows.map((row, curIndex) => curIndex === index ? { ...row, size: height } : row);
    });
  }, [index, onRowsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};