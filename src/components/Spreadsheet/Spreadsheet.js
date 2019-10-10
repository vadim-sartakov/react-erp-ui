import React, { useRef, useState, useEffect, createContext, useContext, useCallback } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ScrollerTree, useResize } from '../';

export const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  style = {},
  value,
  onChange,
  rowsMeta,
  onRowsMetaChange,
  columnsMeta,
  onColumnsMetaChange,
  height,
  initialScroll,
  columnNumbersRowHeight,
  rowNumbersColumnWidth,
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
          value,
          scroll,
          rowsMeta,
          onRowsMetaChange,
          columnsMeta,
          onColumnsMetaChange,
          columnNumbersRowHeight,
          rowNumbersColumnWidth,
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
  value: PropTypes.arrayOf(PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object)
    })),
    children: PropTypes.arrayOf(PropTypes.object)
  })),
  rowsMeta: PropTypes.object,
  columnsMeta: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialScroll: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
  }),
  rowsPerPage: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  columnNumbersRowHeight: PropTypes.number.isRequired,
  rowNumbersColumnWidth: PropTypes.number.isRequired,
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
  columnNumbersRowHeight: 20,
  rowVerticalPadding: 0,
  rowBorderHeight: 1
};

export const SpreadsheetColumnNumbersRow = ({ style = {}, ...props }) => {
  const { columnNumbersRowHeight } = useContext(SpreadsheetContext);
  return <tr {...props} style={{ ...style, height: columnNumbersRowHeight }} />;
};

export const SpreadsheetRowNumbersColumn = ({ Component = 'td', style = {}, ...props }) => {
  const { rowNumbersColumnWidth } = useContext(SpreadsheetContext);
  return <Component {...props} style={{ ...style, width: rowNumbersColumnWidth }} />;
};

export const SpreadsheetTableHeaderCell = ({ Component = 'th', style = {}, meta, ...props }) => {
  const { defaultColumnWidth } = useContext(SpreadsheetContext);
  return <Component {...props} style={{ ...style, width: meta.size || defaultColumnWidth }} />;
};

export const SpreadsheetScrollableHeaderColumns = ({ children }) => {
  const { columnsPerPage, defaultColumnWidth, columnsMeta, scroll, rowNumbersColumnWidth } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={columnsMeta.children}
        // TODO: Duplicate meta passing here. Can we omit this?
        meta={columnsMeta}
        itemsPerPage={columnsPerPage}
        defaultSize={defaultColumnWidth}
        scroll={scroll.left}
        relativePosition={rowNumbersColumnWidth}
        renderGap={width => <th style={{ width }} />}>
      {children}
    </ScrollerTree>
  )
};

export const SpreadsheetScrollableRows = ({ children }) => {
  const { rowsPerPage, defaultRowHeight, scroll, value, rowsMeta, columnNumbersRowHeight, rowVerticalPadding, rowBorderHeight } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={value}
        meta={rowsMeta}
        scroll={scroll.top}
        itemsPerPage={rowsPerPage}
        defaultSize={defaultRowHeight + (rowVerticalPadding * 2) + rowBorderHeight}
        relativePosition={columnNumbersRowHeight}
        renderGap={height => <tr style={{ height }} />}>
      {children}
    </ScrollerTree>
  )
};

export const SpreadsheetScrollableRowColumns = ({ row, children }) => {
  const { columnsPerPage, defaultColumnWidth, scroll, columnsMeta } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={row.columns}
        meta={columnsMeta}
        scroll={scroll.left}
        itemsPerPage={columnsPerPage}
        defaultSize={defaultColumnWidth}
        renderGap={width => <td style={{ width }} />}
        disableCache>
      {children}
    </ScrollerTree>
  )
};

export const SpreadsheetCellValue = ({ mode, style, meta, ...props }) => {
  const { defaultRowHeight } = useContext(SpreadsheetContext);
  const nextStyle = { ...style, height: meta.size || defaultRowHeight, overflow: 'hidden' };
  return <div style={nextStyle} {...props} />;
};

export const SpreadsheetColumnResizer = ({ meta, originMeta, onMetaChange, ...props }) => {
  const { onColumnsMetaChange } = useContext(SpreadsheetContext);
  const sizes = { width: meta.size, height: 0 };
  const handleSizesChange = useCallback(({ width }) => {
    onColumnsMetaChange(meta => {
      const nextMeta = _.cloneDeep(originMeta);

    });
  }, [onColumnsMetaChange, originMeta]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};