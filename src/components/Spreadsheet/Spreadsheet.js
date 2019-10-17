import React, { useRef, useState, useEffect, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Scroller, useResize } from '../';

export const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  style = {},
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
  rowVerticalPadding,
  rowBorderHeight,
  ...props
}) => {
  const scrollerRef = useRef();
  const [scroll, setScroll] = useState(initialScroll);

  useEffect(() => {
    scrollerRef.current.scrollTop = initialScroll.top;
    scrollerRef.current.scrollLeft = initialScroll.left;
  }, [initialScroll]);

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
          rowVerticalPadding,
          rowBorderHeight
        }}>
      {/* TODO: Maybe extract scroller into separate component? */}
      <div
          ref={scrollerRef}
          style={{
            overflow: 'auto',
            height,
            // This is important for Chrome
            overflowAnchor: 'none'
          }}
          onScroll={e => setScroll({ top: e.target.scrollTop, left: e.target.scrollLeft })}>
        <table {...props} style={{ ...style, tableLayout: 'fixed', width: 'min-content' }} />
      </div>
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
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialScroll: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
  }),
  rowsPerPage: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  rowVerticalPadding: PropTypes.number,
  rowBorderHeight: PropTypes.number,
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number,
};
Spreadsheet.defaultProps = {
  initialScroll: { top: 0, left: 0 },
  rowsPerPage: 30,
  columnsPerPage: 20,
  defaultRowHeight: 20,
  defaultColumnWidth: 100,
  rowVerticalPadding: 0,
  rowBorderHeight: 1
};

export const SpreadsheetTableHeaderCell = ({ Component = 'th', style = {}, columnIndex, rowIndex, ...props }) => {
  const { columns, defaultColumnWidth, rows, defaultRowHeight } = useContext(SpreadsheetContext);
  const column = columns[columnIndex];
  const row = rows[rowIndex];
  return <Component {...props} style={{ ...style, width: (column && column.size) || defaultColumnWidth, height: (row && row.size) || defaultRowHeight }} />;
};

export const SpreadsheetScrollableRows = ({ children }) => {
  const { rowsPerPage, defaultRowHeight, scroll, data, rows, rowVerticalPadding, rowBorderHeight } = useContext(SpreadsheetContext);
  return (
    <Scroller
        value={data}
        meta={rows}
        totalCount={data.length}
        scroll={scroll.top}
        itemsPerPage={rowsPerPage}
        defaultSize={defaultRowHeight + (rowVerticalPadding * 2) + rowBorderHeight}>
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
  const nextStyle = { ...style, height: ( row && row.size ) || defaultRowHeight, overflow: 'hidden' };
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