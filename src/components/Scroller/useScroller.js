import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps
} from './utils';

const getCacheValue = (cache, page) => cache.find(item => item && item.page === page);
const addToCacheAndClean = (cache, cacheSize, value) => {
  const nextCache = [...cache, value];
  if (nextCache.length > cacheSize) nextCache.shift();
  return nextCache;
};

const useScroller = ({
  scrollHeight,
  scrollWidth,
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsPerPage,
  columnsPerPage,
  rowsSizes,
  columnsSizes,
  async,
  loadRowsPage,
  loadColumnsPage,
  cacheSize = 3
}) => {

  const [rowsPage, setRowsPage] = useState(0);
  const [columnsPage, setColumnsPage] = useState(0);

  const handleScroll = useCallback(e => {
    const curRowsPage = getPageNumber({
      sizes: rowsSizes,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    const curColumnsPage = getPageNumber({
      sizes: columnsSizes,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [columnsSizes, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, rowsSizes, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);
  
  const visibleRowsPageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const getLoadingPage = useCallback(rowsPage => {
    if (async) {
      const rowsOnPage = getItemsCountOnPage(rowsPage, rowsPerPage, totalRows);
      return [...new Array(rowsOnPage).keys()].map(() => {
        const columns = [...new Array(totalColumns).keys()].map(() => ({ isLoading: true }));
        return columns;
      });
    }
  }, [async, totalColumns, rowsPerPage, totalRows]);

  const [asyncCache, setAsyncCache] = useState([]);
  const syncCache = useRef([]);

  useEffect(() => {
    if (async) {

      visibleRowsPageNumbers.forEach(visiblePageNumber => {

        if (!getCacheValue(asyncCache, visiblePageNumber)) {

          loadRowsPage(visiblePageNumber, rowsPerPage).then(loadResult => {
            const nextAsyncCache = addToCacheAndClean(asyncCache, cacheSize, { page: visiblePageNumber, value: loadResult });
            setAsyncCache(nextAsyncCache);
          });

        }

      }, []);
    }
  }, [
    async,
    asyncCache,
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
      page = getCacheValue(asyncCache, visiblePageNumber) || { page: visiblePageNumber, value: getLoadingPage(visiblePageNumber) };
    } else {
      page = getCacheValue(asyncCache, visiblePageNumber) || { page: visiblePageNumber, value: loadRowsPage(visiblePageNumber, rowsPerPage) };
      addToCacheAndClean(syncCache.current, cacheSize, page);
    };
    return [...acc, page]
  }, []), [async, asyncCache, cacheSize, loadRowsPage, rowsPerPage, visibleRowsPageNumbers, getLoadingPage]);

  const rowsGaps = useMemo(() => {
    return getGaps({
      sizes: rowsSizes,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage
    })
  }, [rowsSizes, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);

  const columnsGaps = useMemo(() => {
    return getGaps({
      sizes: columnsSizes,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage
    })
  }, [columnsSizes, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns]);

  const scrollerStyles = {
    height: scrollHeight,
    width: scrollWidth,
    overflow: 'auto'
  };
  const coverStyles = {
    height: rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps.start + columnsGaps.middle + columnsGaps.end,
    position: 'relative'
  };
  const pagesStyles = {
    top: rowsGaps.start,
    left: columnsGaps.start,
    position: 'absolute'
  };

  const visibleRows = useMemo(() => visibleRowsPages.reduce((acc, page) => [...acc, ...page.value], []), [visibleRowsPages]);
  const visibleColumnsPageNumbers = useMemo(() => getVisiblePages(columnsPage), [columnsPage]);

  const visibleCells = useMemo(() => visibleRows.map(visibleRow => {
    return visibleColumnsPageNumbers.reduce((acc, pageNumber) => [...acc, ...loadColumnsPage(visibleRow, pageNumber, columnsPerPage)], []);
  }), [visibleColumnsPageNumbers, columnsPerPage, loadColumnsPage, visibleRows]);
  
  const rowsStartIndex = visibleRowsPageNumbers[0] * rowsPerPage;
  const columnsStartIndex = visibleColumnsPageNumbers[0] * columnsPerPage;

  return {
    onScroll: handleScroll,
    visibleCells,
    rowsStartIndex,
    columnsStartIndex,
    scrollerStyles,
    coverStyles,
    pagesStyles
  };
};

export default useScroller;