import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const StaticScroller = ({
  ...props
}) => {
  return <div {...props} />
};

StaticScroller.propTypes = {
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

const rowsPerPage = 100;
const columnsPerPage = 50;

const useBufferedPages = (page, value) => {

  // useEffect here will make it laggy
  // So using local variables
  const cache = useRef([]);
  const visiblePages = page === 0 ? [page] : [page - 1, page];

  const getCacheValue = page => cache.find(item => item && item.page === page);

  const cachedPage = getCacheValue(page);
  if (!cachedPage) {
    const newPage = { page, value: loadPage(value, page, rowsPerPage) };
    cache.current.push(newPage);
    if (cache.length > 2) cache.current.shift();
  }

  const visibleValues = visiblePages.current.reduce((acc, visiblePage) => {
    const page = getCacheValue(visiblePage);
    return [...acc, ...page.value]
  }, []);

  return visibleValues;

};

const ScrollColumns = ({ value, column: { pages, expanded, gaps, columns } }) => {

};

const loadPage = (value, page, itemsOnPage) => value.slice(page * itemsOnPage, (page + 1) * itemsOnPage);

const ScrollRows = ({ value, rows: { page, expanded, gaps, rows } }) => {
  const visibleValueRows = useBufferedPages(page, value);
  const visibleRows = useBufferedPages(page, rows);
  return (
    <>
      {gaps.start && <tr style={{ height: gaps.start }} />}
      <tr>
        {visibleRows.map((row, index) => {
          const curValue = visibleValueRows[index];
          return (
            <React.Fragment key={index}>
              <tr>
                <ScrollColumns value={curValue} columns={row.columns} />
              </tr>
              {expanded ? <ScrollRows rows={rows.children} /> : null}
            </React.Fragment>
          )
        })}
      </tr>
      {gaps.end && <tr style={{ height: gaps.end }} />}
    </>
  );
};