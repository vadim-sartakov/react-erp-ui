import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps
} from './utils';
import ScrollerContext from './ScrollerContext';

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

const withScroller = Component => {

  const Scroller = props => {

    const {
      defaultRowHeight,
      defaultColumnWidth,
      totalRows,
      totalColumns,
      rowsPerPage,
      columnsPerPage,
      rows,
      columns,
      async,
      loadRowsPage,
      loadColumnsPage,
      cacheSize = 3
    } = props;

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

    const [lastLoadedPage, setLastLoadedPage] = useState();
    const cache = useRef([]);

    useEffect(() => {
      if (async) {
        visibleRowsPageNumbers.reduce(async (prev, visiblePageNumber) => {
          await prev;
          if (!getCacheValue(cache.current, visiblePageNumber)) {
            const loadResult = await loadRowsPage(visiblePageNumber, rowsPerPage);
            const nextAsyncCache = addToCache(cache.current, { page: visiblePageNumber, value: loadResult });
            cache.current = nextAsyncCache;
            setLastLoadedPage(visiblePageNumber);
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
        page = (lastLoadedPage !== undefined && getCacheValue(cache.current, visiblePageNumber)) || { page: visiblePageNumber, value: getLoadingPage(visiblePageNumber) };
      } else {
        page = getCacheValue(cache.current, visiblePageNumber) || { page: visiblePageNumber, value: loadRowsPage(visiblePageNumber, rowsPerPage) };
        const nextCache = addToCacheAndClean(cache.current, cacheSize, page);
        cache.current = nextCache;
      };
      return [...acc, page]
    }, []), [async, lastLoadedPage, cacheSize, loadRowsPage, rowsPerPage, visibleRowsPageNumbers, getLoadingPage]);

    const rowsGaps = useMemo(() => {
      return getGaps({
        meta: rows,
        defaultSize: defaultRowHeight,
        itemsPerPage: rowsPerPage,
        totalCount: totalRows,
        page: rowsPage
      })
    }, [rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);

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
      height: rowsGaps.start + rowsGaps.middle + rowsGaps.end,
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

    const componentProps = {
      visibleCells,
      rowsStartIndex,
      columnsStartIndex,
      ...props
    };

    return (
      <ScrollerContext.Provider value={{
        onScroll: handleScroll,
        coverStyles,
        pagesStyles
      }}>
        <Component {...componentProps} />
      </ScrollerContext.Provider>
    )

  };

  return Scroller;

};



export default withScroller;