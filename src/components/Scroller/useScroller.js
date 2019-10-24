import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps
} from './utils';

export const loadPageSync = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
const getCacheValue = (cache, page) => cache.current.find(item => item && item.page === page);
const addToCacheAndClean = (cache, cacheSize, page, value) => {
  cache.current.push({ page, value });
  if (cache.current.length > cacheSize) cache.current.shift();
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
  rows,
  columns,
  async,
  loadRowsPage,
  loadColumnsPage,
  cacheSize
}) => {

  const [rowsPage, setRowsPage] = useState(0);
  const [columnsPage, setColumnsPage] = useState(0);

  const handleScroll = useCallback(e => {
    const curRowsPage = getPageNumber({
      sizes: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    const curColumnsPage = getPageNumber({
      sizes: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);
  
  const visibleRowsPageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const getLoadingPage = useCallback(page => {
    if (async) {
      const itemsOnPage = getItemsCountOnPage(page, rowsPerPage, totalRows);
      return [...new Array(itemsOnPage).keys()].map(() => ({ isLoading: true }));
    }
  }, [async, rowsPerPage, totalRows]);

  const [asyncValue, setAsyncValue] = useState(
    async ?
    visibleRowsPageNumbers.map(pageNumber => ({ page: pageNumber, value: getLoadingPage(pageNumber) })) :
    undefined
  );
  
  const cache = useRef([]);

  useEffect(() => {
    if (async) {
      const visibleValues = visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
        let cachedPage = getCacheValue(cache, visiblePageNumber);
        if (cachedPage) {
          return [...acc, cachedPage];
        } else {
          loadRowsPage(visiblePageNumber, rowsPerPage).then(loadResult => {
            addToCacheAndClean(cache, cacheSize, visiblePageNumber, loadResult);
            setAsyncValue(asyncValue => {
              const visibleValue = asyncValue.map(asyncValueItem => {
                return asyncValueItem.page === visiblePageNumber ?
                    { page: visiblePageNumber, value: loadResult } :
                    asyncValueItem
              })
              return visibleValue;
            });
          });
          return [...acc, { page: visiblePageNumber, value: getLoadingPage(visiblePageNumber) }];
        }
      }, []);
      setAsyncValue(visibleValues);
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

  const syncValue = useMemo(() => !async && visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
    let page = getCacheValue(cache, visiblePageNumber);
    if (!page) {
      page = { page: visiblePageNumber, value: loadRowsPage(visiblePageNumber, rowsPerPage) };
      addToCacheAndClean(cache, cacheSize, visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []), [async, cacheSize, loadRowsPage, rowsPerPage, visibleRowsPageNumbers]);

  const visibleRowsPages = async ? asyncValue : syncValue;

  const rowsGaps = useMemo(() => {
    return getGaps({
      sizes: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage
    })
  }, [rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);

  const columnsGaps = useMemo(() => {
    return getGaps({
      sizes: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage
    })
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns]);

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