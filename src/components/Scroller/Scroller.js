import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import useBufferedPages from './useBufferedPages';
import {
  setSyncValueMetaTotalCounts,
  getScrollPages,
  shiftScrollPages,
  getPageNumberFromScrollPages,
  getPageNumberWithDefaultSize,
  getGapsFromScrollPages,
  getGapsWithDefaultSize
} from './utils';

const directionToScrollEventMap = {
  vertical: 'scrollTop',
  horizontal: 'scrollLeft'
};

const Scroller = ({
  meta: metaProp,
  defaultSize,
  itemsPerPage,
  scrollContainerRef,
  scrollDirection,
  relativeScroll,
  value,
  loadPage,
  children
}) => {

  const [page, setPage] = useState(0);
  
  const meta = useMemo(() => loadPage ? undefined : setSyncValueMetaTotalCounts(value, metaProp), [loadPage, value, metaProp]);

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

  const handleScroll = useCallback(event => {
    const scroll = event.target[directionToScrollEventMap[scrollDirection]] - relativeScroll;
    if (scroll < 0) return;
    let currentPage;
    if (meta && meta.children && meta.children.length) {
      const scrollPages = getScrollPages(meta, defaultSize, itemsPerPage);
      //if (scroll > scrollPages[scrollPages.length - 1].end) return;
      const shiftedScrollPages = shiftScrollPages(scrollPages);
      currentPage = getPageNumberFromScrollPages(shiftedScrollPages, scroll);
      //console.log('relativeScroll=%s, scroll=%s, currentPage=%s, scrollPages=%o, shiftedScrollPages=%o', relativeScroll, scroll, currentPage, scrollPages, shiftedScrollPages);
    } else {
      currentPage = getPageNumberWithDefaultSize(defaultSize, itemsPerPage, scroll);
    }
    if (page !== currentPage) setPage(currentPage);
  }, [meta, page, defaultSize, itemsPerPage, scrollDirection, relativeScroll]);

  useEffect(() => {
    if (scrollContainerRef) {
      const node = scrollContainerRef.current;
      node.addEventListener('scroll', handleScroll);
      return () => {
        node.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollContainerRef, handleScroll]);

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
    totalCount: PropTypes.number,
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  defaultSize: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  scrollContainerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  /** Offsets relative to scroll container */
  relativeScroll: PropTypes.number,
  scrollDirection: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,

  /**
   * Component functions in 2 modes: Dynamic and static.
   * Static involves traversing the columns and rows tree while
   * dynamic fetches the data with 'loadPage' callback relying on children count property of rows and columns meta.
   * */
  value: PropTypes.arrayOf(PropTypes.object),
  /** (page, size) => array */
  loadPage: PropTypes.func
};

Scroller.defaultProps = {
  defaultSize: 0,
  relativeScroll: 0,
  itemsPerPage: 40,
  scrollDirection: 'vertical'
};

export default Scroller;