import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import useBufferedPages from './useBufferedPages';
import {
  getScrollPages,
  getPageNumberFromScrollPages,
  getPageNumberWithDefaultSize,
  getGapsFromScrollPages,
  getGapsWithDefaultSize,
  setMetaTotalCount
} from './utils';

const Scroller = ({
  scroll,
  meta: metaProp,
  defaultSize,
  itemsPerPage,
  value,
  loadPage,
  children  
}) => {
  //console.log(value);
  const meta = useMemo(() => value ? setMetaTotalCount(value, metaProp) : metaProp, [value, metaProp]);
  //console.log(meta)

  const getPage = useCallback(scroll => {
    let currentPage;
    if (meta && meta.children && meta.children.length) {
      const scrollPages = getScrollPages(meta, defaultSize, itemsPerPage);
      currentPage = getPageNumberFromScrollPages(scrollPages, scroll);
    } else {
      currentPage = getPageNumberWithDefaultSize({ defaultSize, itemsPerPage, scroll, totalCount: meta.totalCount });
    }
    return currentPage;
  }, [meta, defaultSize, itemsPerPage]);

  const page = useMemo(() => getPage(scroll), [scroll, getPage]);

  // TODO: think about server side meta loading
  const visibleMetaPages = useBufferedPages({
    value: ( meta && meta.children ) || [],
    page,
    itemsPerPage,
    totalCount: meta.totalCount
  });
  const visiblePages = useBufferedPages({
    value,
    page,
    loadPage,
    itemsPerPage,
    totalCount: meta.totalCount
  });

  const gaps = useMemo(() => {
    let result;
    if (meta && meta.children && meta.children.length) {
      const scrollPages = getScrollPages(meta, defaultSize, itemsPerPage);
      result = getGapsFromScrollPages(scrollPages, page);
    } else {
      result = getGapsWithDefaultSize({ defaultSize, itemsPerPage, totalCount: meta.totalCount, page });
    }
    return result;
  }, [page, defaultSize, itemsPerPage, meta]);

  const visibleValuesReducer = (acc, page) => [...acc, ...page.value];

  const visibleValue = visiblePages.reduce(visibleValuesReducer, []);
  const visibleMeta = visibleMetaPages.reduce(visibleValuesReducer, []);

  return (
    <>
      {children({ value: visibleValue, meta: visibleMeta, gaps })}
    </>
  );
};

Scroller.propTypes = {
  meta: PropTypes.shape({
    isLoading: PropTypes.bool,
    /* It's required for async value. For sync it's calculated depending on values children count */
    totalCount: PropTypes.number,
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  defaultSize: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  scroll: PropTypes.number.isRequired,

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
  defaultSize: 0,
  relativeScroll: 0,
  itemsPerPage: 40,
  scrollDirection: 'vertical'
};

export default Scroller;