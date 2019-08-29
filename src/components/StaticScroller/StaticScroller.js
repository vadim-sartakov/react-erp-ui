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

const useVisiblePages = (page, value) => {

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

  // Maybe use meta here?
  const visibleValues = visiblePages.current.reduce((acc, visiblePage) => {
    const page = getCacheValue(visiblePage);
    return [...acc, ...page.value]
  }, []);

  return visibleValues;

};

const ScrollColumns = ({ value, column: { pages, expanded, gaps, columns } }) => {

};

const loadPage = (value, page, itemsOnPage) => value.slice(page * itemsOnPage, (page + 1) * itemsOnPage);

                        // Here should be already visible rows only
const ScrollRows = ({ value, rows: { page, expanded, gaps, rows } }) => {
  const visibleValueRows = useVisiblePages(page, value);
  return (
    <>
      {gaps.start && <tr style={{ height: gaps.start }} />}
      <tr>
        {rows.map((row, index) => {
          // ????
          const curValue = visibleValueRows[index];
          return (
            <React.Fragment key={index}>
              <tr>
                <ScrollColumns value={curValue} columns={row.columns} />
              </tr>
              {expanded ? rows.children.map((child, index) => <ScrollRows key={index} rows={child} />) : null}
            </React.Fragment>
          )
        })}
      </tr>
      {gaps.end && <tr style={{ height: gaps.end }} />}
    </>
  );
};