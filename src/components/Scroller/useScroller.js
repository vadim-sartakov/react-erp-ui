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
  rows,
  columns,
  totalRows,
  totalColumns,
  defaultRowHeight,
  defaultColumnWidth,
  rowsPerPage,
  columnsPerPage,
  async,
  loadPage,
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
  
  const visiblePageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const getLoadingPage = useCallback(page => {
    if (async) {
      const itemsOnPage = getItemsCountOnPage(page, rowsPerPage, totalRows);
      return [...new Array(itemsOnPage).keys()].map(() => ({ isLoading: true }));
    }
  }, [async, rowsPerPage, totalRows]);

  const [asyncValue, setAsyncValue] = useState(
    async ?
    visiblePageNumbers.map(pageNumber => ({ page: pageNumber, value: getLoadingPage(pageNumber) })) :
    undefined
  );
  
  const cache = useRef([]);

  useEffect(() => {
    if (async) {
      const visibleValues = visiblePageNumbers.reduce((acc, visiblePageNumber) => {
        let cachedPage = getCacheValue(cache, visiblePageNumber);
        if (cachedPage) {
          return [...acc, cachedPage];
        } else {
          loadPage(visiblePageNumber, rowsPerPage).then(loadResult => {
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
    visiblePageNumbers,
    rowsPage,
    loadPage,
    getLoadingPage,
    rowsPerPage,
    cacheSize
  ]);

  const syncValue = !async && visiblePageNumbers.reduce((acc, visiblePageNumber) => {
    let page = getCacheValue(cache, visiblePageNumber);
    if (!page) {
      page = { page: visiblePageNumber, value: loadPage(visiblePageNumber, rowsPerPage) };
      addToCacheAndClean(cache, cacheSize, visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []);

  const visibleRowsPages = async ? asyncValue : syncValue;
  const columnsVisiblePages = useMemo(() => getVisiblePages(columnsPage), [columnsPage]);

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

  const visibleValuesReducer = (acc, page) => [...acc, ...page.value];
  const visibleRows = visibleRowsPages.reduce(visibleValuesReducer, []);
  
  const rowsStartIndex = visibleRowsPages[0].page * rowsPerPage;
  const columnsStartIndex = columnsVisiblePages[0].page * columnsPerPage;

  return {
    onScroll: handleScroll,
    visibleRows,
    rowsStartIndex,
    columnsStartIndex,
    rowsGaps,
    columnsGaps
  };
};

export default useScroller;