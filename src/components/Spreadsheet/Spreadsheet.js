import React, { useRef, useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useScroller, ScrollerRow, ScrollerCell, useResize } from '../';

const SpreadsheetContext = createContext();

export const SpreadsheetRow = ({
  style,
  className,
  index,
  fixed,
  ...props
}) => {
  const { classes, rows, defaultRowHeight } = useContext(SpreadsheetContext);

  let nextClassName = classNames(className);

  const nextStyle = { ...style };
  if (fixed) {
    nextClassName = classNames(nextClassName, classes.fixed);
    nextStyle.position = 'sticky';
  }

  const fixedRowOffset = useMemo(() => {
    return;
  }, []);

  if (fixed) {
    nextStyle.zIndex = 3;
    nextStyle.top = fixedRowOffset;
  };

  return <div {...props} className={nextClassName} style={nextStyle} />
};

export const Spreadsheet = ({
  style,
  data,
  onDataChange,
  rows,
  onRowsChange,
  columns,
  onColumnsChange,
  height,
  ...props
}) => {
  return (
    <SpreadsheetContext.Provider
        value={{
          data,
          onDataChange,
          rows,
          onRowsChange,
          columns,
          onColumnsChange
        }}>
      <div {...props} style={{ ...style, display: 'inline-block', position: 'relative' }} />
    </SpreadsheetContext.Provider>
  )
};
Spreadsheet.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.shape({
    value: PropTypes.any,
    format: PropTypes.func,
    formula: PropTypes.string,
    text: PropTypes.string,
    style: PropTypes.shape({
      backgroundColor: PropTypes.string,
      border: PropTypes.arrayOf(
        PropTypes.shape({
          position: PropTypes.oneOf(['top', 'bottom', 'right', 'left', 'all']),
          size: PropTypes.number,
          color: PropTypes.string
        })
      )
    })
  })]))),
  rows: PropTypes.arrayOf(PropTypes.shape({
    size: PropTypes.number,
    hidden: PropTypes.bool,
    level: PropTypes.number
  })),
  columns: PropTypes.arrayOf(PropTypes.shape({
    size: PropTypes.number,
    hidden: PropTypes.bool,
    level: PropTypes.number
  })),
  rowsPerPage: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number,
  classes: PropTypes.shape({
    fixed: PropTypes.string,
    lastFixedRowCell: PropTypes.string,
    lastFixedColumnCell: PropTypes.string
  })
};
Spreadsheet.defaultProps = {
  rowsPerPage: 30,
  columnsPerPage: 20,
  defaultRowHeight: 20,
  defaultColumnWidth: 100,
  classes: {}
};

export const SpreadsheetTableCell = ({
  className,
  style = {},
  columnIndex,
  rowIndex,
  ...props
}) => {
  const { classes, columns, defaultColumnWidth, rows } = useContext(SpreadsheetContext);
  const column = columns[columnIndex];
  const row = rows[rowIndex];

  const nextStyle = {
    ...style,
    display: 'inline-block',
    width: (column && column.size) || defaultColumnWidth
  };
  let nextClassName = classNames(className);

  const fixedColumn = column && column.fixed;
  const fixedRow = row && row.fixed;
  if (fixedColumn) {
    nextClassName = classNames(nextClassName, classes.fixed);
    nextStyle.position = 'sticky';
  }

  const fixedColumnOffset = useMemo(() => {
    return;
  }, []);

  if (fixedColumn) {
    nextStyle.zIndex = 2;
    nextStyle.left = fixedColumnOffset;
  };
  if (fixedRow && fixedColumn) {
    nextStyle.zIndex = 4;
  }
  return (
    <div
        {...props}
        className={nextClassName}
        style={nextStyle} />
  );
};

/*export const SpreadsheetScrollableRows = ({ children }) => {
  const { rowsPerPage, data, rows, defaultRowHeight } = useContext(SpreadsheetContext);
  const scroll = useContext(ScrollContext);

  const fixedRowsValues = useMemo(() => {
    const fixedRows = rows.filter(row => row && row.fixed && !row.special);
    const fixedData = fixedRows.map((row, index) => data[index]);
    const fixedDataSize = fixedRows.reduce((acc, fixedRow) => acc + (fixedRow.size || defaultRowHeight), 0);
    return {
      fixedData,
      fixedRows,
      fixedDataSize
    };
  }, [rows, data, defaultRowHeight]);

  return (
    <Scroller
        value={data}
        meta={rows}
        totalCount={data.length}
        scroll={scroll.top}
        itemsPerPage={rowsPerPage}
        defaultSize={defaultRowHeight}>
      {({ gaps, value, startIndex }) => {
        const shouldRenderFixed = fixedRowsValues.fixedRows.length > 0 && startIndex > 0;
        return (
          <>
            {gaps.start ? <div style={{ height: gaps.start - (shouldRenderFixed ? fixedRowsValues.fixedDataSize : 0) }} /> : null}
            {shouldRenderFixed && fixedRowsValues.fixedData.map((fixedRow, index) => children({ value: fixedRow, index }))}
            {value.map((row, rowIndex) => {
              const index = row.index || (startIndex + rowIndex);
              return children({ value: row, index });
            })}
            {gaps.end ? <div style={{ height: gaps.end }} /> : null}
          </>
        )
      }}
    </Scroller>
  )
};*/

export const SpreadsheetCellValue = ({ mode, style, rowIndex, ...props }) => {
  const { rows, defaultRowHeight } = useContext(SpreadsheetContext);
  const row = rows[rowIndex];
  const nextStyle = {
    ...style,
    height: (row && row.size) || defaultRowHeight,
    overflow: 'hidden'
  };
  return <div {...props} style={nextStyle} />;
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
      const nextRows = [...(rows || [])];
      nextRows[index] = { ...(nextRows[index] || {}), size: height };
      return nextRows;
    });
  }, [index, onRowsChange]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};