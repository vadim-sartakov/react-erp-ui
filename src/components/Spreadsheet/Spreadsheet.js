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
  defaultColumnWidth,
  defaultRowHeight,
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
        <table {...props} style={{ ...style, tableLayout: 'fixed' }} />
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

export const SpreadsheetHeaderColumnsRow = ({ style = {}, ...props }) => {
  const { columnNumbersRowHeight } = useContext(SpreadsheetContext);
  return <tr {...props} style={{ ...style, height: columnNumbersRowHeight }} />
};

export const SpreadsheetTableHeaderCell = ({ Component = 'th', style = {}, meta, ...props }) => {
  const { defaultColumnWidth } = useContext(SpreadsheetContext);
  return <Component {...props} style={{ ...style, width: meta.size || defaultColumnWidth }} />;
};

export const SpreadsheetScrollableHeaderColumns = ({ children }) => {
  const { columnsMeta, scroll } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={columnsMeta}
        // TODO: Duplicate meta passing here. Can we omit this?
        meta={columnsMeta}
        scroll={scroll.left}
        renderGap={width => <th style={{ width }} />}>
      {children}
      {/** Put column resizer here */}
    </ScrollerTree>
  )
};

export const SpreadsheetScrollableRows = ({ children }) => {
  const { scroll, value, rowsMeta, columnNumbersRowHeight } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={value}
        meta={rowsMeta}
        scroll={scroll.top}
        relativePosition={columnNumbersRowHeight}
        renderGap={height => <tr style={{ height }} />}>
      {children}
      {/** Rows resizer goes here */}
    </ScrollerTree>
  )
};

export const SpreadsheetScrollableRowColumns = ({ row, children }) => {
  const { scroll, columnsMeta } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={row.columns}
        meta={columnsMeta}
        scroll={scroll.left}
        renderGap={width => <td style={{ width }} />}>
      {children}
    </ScrollerTree>
  )
};