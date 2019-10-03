import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollerTree } from '../Scroller';

export const SpreadsheetContext = createContext();

export const Spreadsheet = ({
  value,
  height,
  initialScroll,
  ...props
}) => {
  const scrollerRef = useRef();
  const [scroll, setScroll] = useState(initialScroll);
  const [rowsMeta, setRowsMeta] = useState({ totalCount: value.length });
  // TODO: Looks clunky
  const [columnsMeta, setColumnsMeta] = useState({ totalCount: value && value.length && value[0].columns && value[0].columns.length });

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
          setRowsMeta,
          columnsMeta,
          setColumnsMeta
        }}>
      <div
          ref={scrollerRef}
          style={{
            overflow: 'auto',
            height,
            // This is important for Chrome
            overflowAnchor: 'none'
          }}
          onScroll={e => setScroll({ top: e.target.scrollTop, left: e.target.scrollLeft })}>
        <table {...props} />
      </div>
    </SpreadsheetContext.Provider>
  )
};
Spreadsheet.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialScroll: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
  }),
  rowsPerPage: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number,
};
Spreadsheet.defaultProps = {
  initialScroll: { top: 0, left: 0 },
  rowsPerPage: 60,
  columnsPerPage: 40,
  defaultRowHeight: 20,
  defaultColumnWidth: 100
};

export const SpreadsheetHeader = ({ children }) => {
  const { columnsMeta, scroll } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={columnsMeta}
        meta={columnsMeta}
        scroll={scroll.left}
        renderGap={width => <th style={{ width }} />}>
      {children}
      {/** Put column resizer here */}
    </ScrollerTree>
  )
};

export const SpreadsheetBody = props => <tbody {...props} />;
export const SpreadsheetRow = ({ children }) => {
  const { scroll, value, rowsMeta } = useContext(SpreadsheetContext);
  return (
    <ScrollerTree
        value={value}
        meta={rowsMeta}
        scroll={scroll.top}
        renderGap={height => <tr style={{ height }} />}>
      {children}
      {/** Rows resizer goes here */}
    </ScrollerTree>
  )
};

export const SpreadsheetColumn = ({ row, children }) => {
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