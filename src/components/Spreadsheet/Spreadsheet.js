import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ScrollerRow, ScrollerCell } from '../Scroller'
import ScrollerContext from '../Scroller/ScrollerContext';
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
  const rootRef = useRef();
  const contextValue = useMemo(() => ({
    onRowsChange,
    onColumnsChange,
    defaultColumnWidth,
    defaultRowHeight,
    fixRows,
    fixColumns,
    rootRef
  }), [onRowsChange, onColumnsChange, defaultColumnWidth, defaultRowHeight, fixRows, fixColumns]);
  return (
    <SpreadsheetContext.Provider
        value={contextValue}>
      <div {...props} ref={rootRef} style={{ ...style, display: 'inline-block', position: 'relative' }} />
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
  const { fixRows, fixColumns, rootRef } = useContext(SpreadsheetContext);
  // For adjsuting merged cell position wher scrolling.
  // Didn't find better way to position merged cells over the fixed ranges.
  const { pagesStyles } = useContext(ScrollerContext);
  const [, setRootRefState] = useState();

  // On initial render ref is undefined, so triggering rerender
  useEffect(function forcdeRerender () {
    setRootRefState(rootRef);
  }, [rootRef]);

  const fixed = rowIndex <= fixRows || columnIndex <= fixColumns;

  let top = 0, left = 0;
  if (fixed) {
    top = rowIndex > 0 ? getMergedSize({ count: rowIndex, meta: rows, startIndex: 0, defaultSize: defaultRowHeight }) : 0;
    left = columnIndex > 0 ? getMergedSize({ count: columnIndex, meta: columns, startIndex: 0, defaultSize: defaultColumnWidth }) : 0;
  };
  const elementStyle = fixed ? { position: 'fixed', top: 'auto', left: 'auto' } : { position: 'absolute', top: 0, left: 0, zIndex: 1 };

  const width = getMergedSize({
    // Preventing from merging more than fixed range
    count: fixed ? fixColumns : value.colSpan,
    meta: columns,
    startIndex: columnIndex,
    defaultSize: defaultColumnWidth
  });
  const height = getMergedSize({
    count: fixed ? fixRows : value.rowSpan,
    meta: rows,
    startIndex: rowIndex,
    defaultSize: defaultRowHeight
  });
  if (width) elementStyle.width = width;
  if (height) elementStyle.height = height;
  const element = <ScrollerCell {...props} style={elementStyle}>{children}</ScrollerCell>;
  return fixed ? (rootRef.current && createPortal((
    <div style={{ position: 'absolute', zIndex: 4, top: top - pagesStyles.top, left: left - pagesStyles.left }}>
      {element}
    </div>
  ), rootRef.current)) || null : element;
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