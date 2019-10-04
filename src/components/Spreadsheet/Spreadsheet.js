import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollerTree } from '../Scroller';

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
          defaultRowHeight
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
        <table {...props} style={{ tableLayout: 'fixed', width: 'min-content', ...style }} />
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
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number,
};
Spreadsheet.defaultProps = {
  initialScroll: { top: 0, left: 0 },
  rowsPerPage: 60,
  columnsPerPage: 40,
  defaultRowHeight: 20,
  defaultColumnWidth: 100,
  columnNumbersRowHeight: 20,
  rowNumbersColumnWidth: 20
};

export const SpreadsheetColumnNumbersRow = ({ style = {}, ...props }) => {
  const { columnNumbersRowHeight } = useContext(SpreadsheetContext);
  return <tr {...props} style={{ ...style, height: columnNumbersRowHeight }} />;
};

export const SpreadsheetRowNumbersColumn = ({ style = {}, ...props }) => {
  const { rowNumbersColumnWidth } = useContext(SpreadsheetContext);
  return <td {...props} style={{ ...style, width: rowNumbersColumnWidth }} />;
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
  const { rowsPerPage, defaultRowHeight, scroll, value, rowsMeta, columnNumbersRowHeight } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={value}
        meta={rowsMeta}
        scroll={scroll.top}
        itemsPerPage={rowsPerPage}
        defaultSize={defaultRowHeight}
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
        renderGap={width => <td style={{ width }} />}>
      {children}
    </ScrollerTree>
  )
};