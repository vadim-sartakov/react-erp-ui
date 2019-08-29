import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const StaticScroller1 = ({
  ...props
}) => {
  return <div {...props} />
};

StaticScroller1.propTypes = {
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    height: PropTypes.number
  })).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    width: PropTypes.number
  })).isRequired
};

const exampleRows = {
  paddings: {
    start: 20,
    end: 50
  },
  page: 5,
  rows: [ // Already shrinked visible rows meta
    {
      size: 10,
      expanded: true,
      paddings: {/* ... */},
      rows: [
        // ...
      ]
    }
  ]
  // ...
};

const exampleColumns = {
  paddings: {
    start: 10,
    end: 20
  },
  rows: [
    {
      size: 20,
      expanded: true,
      paddings: {/* ... */},
      columns: [
        // ...
      ]
    }
  ]
  // ...
};

// Second column expanded
// Third row expanded
const exampleValue = [ // Rows
  { //Row 0
    columns: [ // Columns
      { // Column 0 (Cell 0-0)
        value: 'Value 0 - 0'
      },
      { // Column 1 (Cell 0-1)
        value: 'Value 0 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 0-1-0)
            value: 'Value 0 - 1 - 0'
          },
          { // Column 1 (Cell 0-1-1)
            value: 'Value 0 - 1 - 1'
          }
        ]
      }
    ]
  },
  { // Row 1
    columns: [ // Columns
      { // Column 0 (Cell 1-0)
        value: 'Value 1 - 0'
      },
      { // Column 1 (Cell 1-1)
        value: 'Value 1 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 1-1-0)
            value: 'Value 1 - 1 - 0'
          },
          { // Column 1 (Cell 1-1-1)
            value: 'Value 1 - 1 - 1'
          }
        ]
      }
    ]
  },
  { //Row 2
    columns: [ // Columns
      { // Column 0 (Cell 2-0)
        value: 'Value 2 - 0'
      },
      { // Column 0 (Cell 2-1)
        value: 'Value 2 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 2-1-0)
            value: 'Value 2 - 1 - 0'
          },
          { // Column 1 (Cell 2-1-1)
            value: 'Value 2 - 1 - 1'
          }
        ]
      }
    ],
    children: [
      {
        columns: [
          // ... the same column structure as for previous rows
        ]
      }
    ]
  },
];

const useBufferedPages = (page, value, itemsPerPage, loadPage) => {

  // useEffect here will make it laggy
  // So using local variables
  const cache = useRef([]);
  const visiblePages = page === 0 ? [page] : [page - 1, page];

  const getCacheValue = page => cache.find(item => item && item.page === page);

  const cachedPage = getCacheValue(page);
  if (!cachedPage) {
    const newPage = { page, value: loadPage(value, page, itemsPerPage) };
    cache.current.push(newPage);
    if (cache.length > 2) cache.current.shift();
  }

  const visibleValues = visiblePages.current.reduce((acc, visiblePage) => {
    const page = getCacheValue(visiblePage);
    return [...acc, ...page.value]
  }, []);

  return visibleValues;

};

const ScrollColumns = ({
  columnsPerPage,
  value,
  columns: { page, expanded, paddings, columns }, 
  children,
  depth = 0
}) => {
  const visibleValueRows = useBufferedPages(page, value, columnsPerPage, loadPage);
  const visibleRows = useBufferedPages(page, columns, columnsPerPage, loadPage);
  return (
    <>
      {paddings.start && <td style={{ height: paddings.start }} />}
      {visibleRows.map((row, index) => {
        const rowValue = visibleValueRows[index];
        return (
          <React.Fragment key={index}>
            {children(rowValue, row.columns)}
            {expanded ? row.children.map((child, index) => {
              const curChildValue = rowValue.children[index];
              return <ScrollColumns key={index} value={curChildValue} rows={child} depth={depth + 1} />
            }) : null}
          </React.Fragment>
        )
      })}
      {paddings.end && <td style={{ height: paddings.end }} />}
    </>
  );
};

const ScrollRows = ({
  rowsPerPage,
  value,
  rows: { page, expanded, paddings, rows },
  loadPage,
  depth = 0,
  children
}) => {
  const visibleValueRows = useBufferedPages(page, value, rowsPerPage, loadPage);
  const visibleRows = useBufferedPages(page, rows, rowsPerPage, loadPage);
  return (
    <>
      {paddings.start && <tr style={{ height: paddings.start }} />}
      {visibleRows.map((row, index) => {
        const rowValue = visibleValueRows[index];
        return (
          <React.Fragment key={index}>
            {children(rowValue, row.columns)}
            {expanded ? row.children.map((child, index) => {
              const curChildValue = rowValue.children[index];
              return (
                <ScrollRows key={index} value={curChildValue} rows={child} depth={depth + 1}>
                  {children}
                </ScrollRows>
              )
            }) : null}
          </React.Fragment>
        )
      })}
      {paddings.end && <tr style={{ height: paddings.end }} />}
    </>
  );
};

const ScrollItems = ({
  itemsPerPage,
  value,
  meta: { page, expanded, paddings, children: metaChildren },
  loadPage,
  depth = 0,
  renderPadding,
  children
}) => {
  const visibleValue = useBufferedPages(page, value, itemsPerPage, loadPage);
  const visibleMeta = useBufferedPages(page, metaChildren, itemsPerPage, loadPage);
  return (
    <>
      {paddings.start && renderPadding({ paddingTop: paddings.top })}
      {visibleMeta.map((metaItem, index) => {
        const value = visibleValue[index];
        return (
          <React.Fragment key={index}>
            {children(value, depth)}
            {expanded ? metaChildren.map((child, index) => {
              const curChildValue = value.children[index];
              return (
                <ScrollItems key={index} value={curChildValue} meta={child} depth={depth + 1}>
                  {children}
                </ScrollItems>
              )
            }) : null}
          </React.Fragment>
        )
      })}
      {paddings.end && renderPadding({ paddingTop: paddings.bottom })}
    </>
  );
};

const StaticScroller = ({
  children,
  scrollTop,
  scrollLeft,
  ...props
}) => {

  const getRowsAndColumns = useCallback((scrollLeft, scrollTop) => {
    // Calculate object somehow
    return {
      rows: {},
      columns: {},
      margins: {}
    }
  }, []);

  const [state, setState] = useState(() => getRowsAndColumns(scrollLeft, scrollTop));

  const handleScroll = e => {
    const nextState = getRowsAndColumns(e.scrollLeft, e.scrollTop);
    setState(nextState);
  };

  return state ? (
    <div {...props} onScroll={handleScroll}>
      {children(state)}
    </div>
  ) : null;
};

const loadPage = (value, page, itemsOnPage) => value.slice(page * itemsOnPage, (page + 1) * itemsOnPage);

const TestTable = props => {
  
  const value = exampleValue;

  return (
    <StaticScroller>
      {({ rows, columns, margins }) => {
        const nextStyle = {
          marginTop: margins.top,
          marginBottom: margins.bottom,
          marginLeft: margins.left,
          marginRight: margins.right,
        };
        return (
          <table style={nextStyle}>
            <tbody>
              <ScrollItems
                  itemsPerPage={20}
                  value={value}
                  meta={rows}
                  loadPage={loadPage}
                  renderPadding={props => <tr {...props} />}>
                {(value, depth) => (
                  <tr>
                    <ScrollItems
                        itemsPerPage={50}
                        value={value}
                        meta={columns}
                        loadPage={loadPage}
                        renderPadding={props => <td {...props} />} />
                  </tr>
                )}
              </ScrollItems>
            </tbody>
          </table>
        )
      }}
    </StaticScroller>
  )
};