import React, { useRef, useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getFixedCellOffset } from './utils';
import { Scroller, useResize } from '../';

export const useSpreadsheet = ({
  initialScroll = { top: 0, left: 0 }
}) => {
  const [scroll, setScroll] = useState(initialScroll);
  return {
    scroll,
    onScroll: setScroll
  };
};

export const SpreadsheetContext = createContext();

export const SpreadsheetScroller = ({
  height,
  onScroll,
  style = {},
  initialScroll,
  ...props
}) => {
  const scrollerRef = useRef();
  useEffect(() => {
    if (initialScroll) {
      scrollerRef.current.scrollTop = initialScroll.top;
      scrollerRef.current.scrollLeft = initialScroll.left;
    }
  }, [initialScroll]);
  return (
    <div
        ref={scrollerRef}
        {...props}
        style={{
          ...style,
          overflow: 'auto',
          height,
          // This is important for Chrome
          overflowAnchor: 'none'
        }}
        onScroll={e => onScroll({ top: e.target.scrollTop, left: e.target.scrollLeft })} />
  )
};

SpreadsheetScroller.propTypes = {
  initialScroll: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
  }),
  onScroll: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export const Spreadsheet = ({
  style = {},
  scroll,
  data,
  onDataChange,
  rows,
  onRowsChange,
  columns,
  onColumnsChange,
  height,
  initialScroll,
  defaultColumnWidth,
  defaultRowHeight,
  rowsPerPage,
  columnsPerPage,
  classes,
  ...props
}) => {
  return (
    <SpreadsheetContext.Provider
        value={{
          data,
          onDataChange,
          scroll,
          rows,
          onRowsChange,
          columns,
          onColumnsChange,
          rowsPerPage,
          columnsPerPage,
          defaultColumnWidth,
          defaultRowHeight,
          classes
        }}>
      <table {...props} style={{ ...style, tableLayout: 'fixed', width: 'min-content' }} />
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
  header,
  columnIndex,
  rowIndex,
  ...props
}) => {
  const { classes, columns, defaultColumnWidth, rows, defaultRowHeight } = useContext(SpreadsheetContext);
  const column = columns[columnIndex];
  const row = rows[rowIndex];

  const Component = header ? 'th' : 'td';
  const nextStyle = { ...style };
  let nextClassName = classNames(className);
  if (header) nextStyle.width = (column && column.size) || defaultColumnWidth;

  const fixedRow = row && row.fixed;
  const fixedColumn = column && column.fixed;
  if (fixedRow || fixedColumn) {
    nextClassName = classNames(nextClassName, classes.fixed);
    nextStyle.position = 'sticky';
  }

  const fixedRowOffset = useMemo(() => {
    return fixedRow && getFixedCellOffset({ meta: rows, defaultSize: defaultRowHeight, index: rowIndex })
  }, [rows, defaultRowHeight, rowIndex, fixedRow]);

  const fixedColumnOffset = useMemo(() => {
    return fixedColumn && getFixedCellOffset({ meta: columns, defaultSize: defaultColumnWidth, index: columnIndex })
  }, [columns, defaultColumnWidth, columnIndex, fixedColumn]);

  if (fixedRow) {
    nextStyle.zIndex = 3;
    nextStyle.top = fixedRowOffset;
  };
  if (fixedColumn) {
    nextStyle.zIndex = 2;
    nextStyle.left = fixedColumnOffset;
  };
  if (fixedRow && fixedColumn) {
    nextStyle.zIndex = 4;
  }
  return (
    <Component
        {...props}
        className={nextClassName}
        style={nextStyle} />
  );
};

export const SpreadsheetScrollableRows = ({ children }) => {
  const { rowsPerPage, scroll, data, rows, defaultRowHeight } = useContext(SpreadsheetContext);
  return (
    <Scroller
        value={data}
        meta={rows}
        totalCount={data.length}
        scroll={scroll.top}
        itemsPerPage={rowsPerPage}
        defaultSize={defaultRowHeight}>
      {({ gaps, value, startIndex }) => (
        <>
          {gaps.start ? <tr style={{ height: gaps.start }} /> : null}
          {value.map((row, rowIndex) => {
            const index = startIndex + rowIndex;
            return children({ value: row, index, row: rows[index] });
          })}
          {gaps.end ? <tr style={{ height: gaps.end }} /> : null}
        </>
      )}
    </Scroller>
  )
};

export const SpreadsheetCellValue = ({ mode, style, rowIndex, ...props }) => {
  const { rows, defaultRowHeight } = useContext(SpreadsheetContext);
  const row = rows[rowIndex];
  const height = (( row && row.size ) || defaultRowHeight);
  const nextStyle = { ...style, height, overflow: 'hidden' };
  return <div style={nextStyle} {...props} />;
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