import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import useBufferedPages from './useBufferedPages';
import {
  getScrollPages,
  getPageNumberFromScrollPages,
  getPageNumberWithDefaultSize,
  getGapsFromScrollPages,
  getGapsWithDefaultSize
} from './utils';

const Scroller = ({
  scroll: scrollProp,
  relativePosition,
  meta,
  totalCount,
  defaultSize,
  itemsPerPage,
  value,
  loadPage,
  disableCache,
  children
}) => {
  
  const scroll = scrollProp - relativePosition;
  const scrollPages = useMemo(() => meta && getScrollPages({ meta, defaultSize, itemsPerPage, totalCount }), [meta, defaultSize, itemsPerPage, totalCount]);

  const getPage = useCallback(scroll => {
    let currentPage;
    if (meta && meta.length) {
      currentPage = getPageNumberFromScrollPages(scrollPages, scroll);
    } else {
      currentPage = getPageNumberWithDefaultSize({ defaultSize, itemsPerPage, scroll, totalCount });
    }
    return currentPage;
  }, [meta, defaultSize, itemsPerPage, scrollPages, totalCount]);

  const page = useMemo(() => getPage(scroll), [scroll, getPage]);

  // TODO: think about server side meta loading
  const visibleMetaPages = useBufferedPages({
    value: meta,
    page,
    itemsPerPage,
    totalCount: totalCount
  });
  const visiblePages = useBufferedPages({
    value,
    page,
    loadPage,
    itemsPerPage,
    totalCount: totalCount,
    disableCache
  });

  const gaps = useMemo(() => {
    let result;
    if (meta && meta.length) {
      result = getGapsFromScrollPages(scrollPages, page);
    } else {
      result = getGapsWithDefaultSize({ defaultSize, itemsPerPage, totalCount, page });
    }
    return result;
  }, [page, defaultSize, itemsPerPage, meta, scrollPages, totalCount]);

  const visibleValuesReducer = (acc, page) => [...acc, ...page.value];

  const visibleValue = visiblePages.reduce(visibleValuesReducer, []);
  const visibleMeta = visibleMetaPages.reduce(visibleValuesReducer, []);

  const startIndex = visiblePages[0].page * itemsPerPage;

  return (
    <>
      {children({ value: visibleValue, meta: visibleMeta, gaps, originMeta: meta, startIndex })}
    </>
  );
};

Scroller.propTypes = {
  scroll: PropTypes.number.isRequired,
  relativePosition: PropTypes.number,
  meta: PropTypes.arrayOf(PropTypes.shape({
    size: PropTypes.number,
    hidden: PropTypes.bool,
    level: PropTypes.number
  })),
  totalCount: PropTypes.number.isRequired,
  defaultSize: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,

  /*
   * Component functions in 2 modes: Dynamic and static.
   * Static involves traversing the columns and rows tree while
   * dynamic fetches the data with 'loadPage' callback relying on children count property of rows and columns meta.
  */
  value: PropTypes.any,
  /* (page, size) => array */
  loadPage: PropTypes.func
};

Scroller.defaultProps = {
  scroll: 0,
  relativePosition: 0,
  meta: [],
  defaultSize: 0,
  relativeScroll: 0,
  itemsPerPage: 40,
  scrollDirection: 'vertical'
};

export default Scroller;