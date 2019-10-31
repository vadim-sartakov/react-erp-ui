import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps
} from './utils';

const getCacheValue = (cache, page) => cache.find(item => item && item.page === page);
const addToCache = (cache, value) => getCacheValue(cache, value.page) ? cache : [...cache, value];
const cleanCache = (cache, cacheSize) => {
  const nextCache = [...cache];
  if (nextCache.length > cacheSize) nextCache.shift();
  return nextCache;
};
const addToCacheAndClean = (cache, cacheSize, value) => {
  let nextCache = addToCache(cache, value);
  nextCache = cleanCache(nextCache, cacheSize);
  return nextCache;
};

const useScroller = ({
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsPerPage,
  columnsPerPage,
  rows,
  columns,
  async,
  lazy,
  loadRowsPage,
  loadColumnsPage,
  cacheSize = 3
}) => {

  const lastRowsPage = useRef(1);
  const [rowsPage, setRowsPage] = useState(0);
  const [columnsPage, setColumnsPage] = useState(0);

  const handleScroll = useCallback(e => {
    const curRowsPage = getPageNumber({
      meta: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    const curColumnsPage = getPageNumber({
      meta: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    if (curRowsPage > lastRowsPage.current) lastRowsPage.current = curRowsPage;
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);
  
  const visibleRowsPageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const getLoadingPage = useCallback(rowsPage => {
    if (async) {
      const rowsOnPage = getItemsCountOnPage(rowsPage, rowsPerPage, totalRows);
      return [...new Array(rowsOnPage).keys()].map(() => {
        return totalColumns ? [...new Array(totalColumns).keys()].map(() => ({ isLoading: true })) : { isLoading: true };
      });
    }
  }, [async, totalColumns, rowsPerPage, totalRows]);

  const [loadedValue, setLoadedValue] = useState();
  const cache = useRef([]);

  useEffect(() => {
    if (async) {
      visibleRowsPageNumbers.reduce(async (prev, visiblePageNumber) => {
        await prev;
        if (!getCacheValue(cache.current, visiblePageNumber)) {
          const loadResult = await loadRowsPage(visiblePageNumber, rowsPerPage);
          const nextAsyncCache = addToCache(cache.current, { page: visiblePageNumber, value: loadResult });
          cache.current = nextAsyncCache;
          setLoadedValue(loadResult);
        }
      }, Promise.resolve());
    }
  }, [
    async,
    visibleRowsPageNumbers,
    rowsPage,
    loadRowsPage,
    getLoadingPage,
    rowsPerPage,
    cacheSize
  ]);

  const visibleRowsPages = useMemo(() => visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
    let page;
    if (async) {
      page = (loadedValue !== undefined && getCacheValue(cache.current, visiblePageNumber)) || { page: visiblePageNumber, value: getLoadingPage(visiblePageNumber) };
    } else {
      page = getCacheValue(cache.current, visiblePageNumber) || { page: visiblePageNumber, value: loadRowsPage(visiblePageNumber, rowsPerPage) };
      const nextCache = addToCacheAndClean(cache.current, cacheSize, page);
      cache.current = nextCache;
    };
    return [...acc, page]
  }, []), [async, loadedValue, cacheSize, loadRowsPage, rowsPerPage, visibleRowsPageNumbers, getLoadingPage]);

  const rowsGaps = useMemo(() => {
    return getGaps({
      meta: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage
    });
  }, [rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);

  const lastRowsPageGaps = lazy && getGaps({
    meta: rows,
    defaultSize: defaultRowHeight,
    itemsPerPage: rowsPerPage,
    totalCount: totalRows,
    page: lastRowsPage.current
  });

  const columnsGaps = useMemo(() => {
    return totalColumns && getGaps({
      meta: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage
    });
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns]);

  const coverStyles = {
    height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps && (columnsGaps.start + columnsGaps.middle + columnsGaps.end),
    position: 'relative'
  };
  const pagesStyles = {
    top: rowsGaps.start,
    left: columnsGaps && columnsGaps.start,
    position: 'absolute'
  };

  const visibleRows = useMemo(() => visibleRowsPages.reduce((acc, page) => [...acc, ...page.value], []), [visibleRowsPages]);
  const visibleColumnsPageNumbers = useMemo(() => getVisiblePages(columnsPage), [columnsPage]);

  const visibleCells = useMemo(() => loadColumnsPage ? visibleRows.map(visibleRow => {
    return visibleColumnsPageNumbers.reduce((acc, pageNumber) => [...acc, ...loadColumnsPage(visibleRow, pageNumber, columnsPerPage)], []);
  }) : visibleRows, [visibleColumnsPageNumbers, columnsPerPage, loadColumnsPage, visibleRows]);
  
  const rowsStartIndex = visibleRowsPageNumbers[0] * rowsPerPage;
  const columnsStartIndex = visibleColumnsPageNumbers[0] * columnsPerPage;

  const scrollerProps = {
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    defaultRowHeight,
    defaultColumnWidth,
    rows,
    columns
  };

  return {
    visibleCells,
    rowsStartIndex,
    columnsStartIndex,
    scrollerProps
  };

};

export default useScroller;