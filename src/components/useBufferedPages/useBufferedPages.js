import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const useBufferedPages = ({ value, page, itemsPerPage, loadPage, totalCount, cacheSize = 3 }) => {

  const visiblePageNumbers = useMemo(() => page === 0 ? [page] : [page - 1, page], [page]);

  const itemsOnPage = useMemo(() => {
    const itemsOnFirstPage = Math.min(totalCount, itemsPerPage);
    const itemsOnSecondPage = page > 0 ? Math.min(totalCount - (page * itemsPerPage), itemsPerPage) : 0;
    return [itemsOnFirstPage, itemsOnSecondPage]
  }, [itemsPerPage, page, totalCount]);

  const getLoadingPage = useCallback(count => [...new Array(count).keys()].map(() => ({ isLoading: true })), []);
  const [asyncValue, setAsyncValue] = useState(loadPage ? visiblePageNumbers.map((visiblePageNumber, index) => {
    // Marking every row on visible page as loading
    const value = [...getLoadingPage(itemsOnPage[index])];
    return {
      page: visiblePageNumber,
      value: [...value]
    }
  }) : null);
  const cache = useRef([]);

  const loadPageSync = useCallback((page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage), [value]);
  const getCacheValue = useCallback(page => cache.current.find(item => item && item.page === page), []);
  const addToCacheAndClean = useCallback((page, value) => {
    cache.current.push({ page, value });
    if (cache.current.length > cacheSize) cache.current.shift();
  }, [cacheSize]);

  useEffect(() => {
    if (loadPage) {
      const visibleValues = visiblePageNumbers.reduce((acc, visiblePageNumber, index) => {
        let cachedPage = getCacheValue(visiblePageNumber);
        if (cachedPage) {
          return [...acc, cachedPage];
        } else {
          loadPage(visiblePageNumber, itemsPerPage).then(loadedValue => {
            addToCacheAndClean(visiblePageNumber, loadedValue);
            setAsyncValue(asyncValue => {
              return asyncValue.map(asyncValueItem => {
                return asyncValueItem.page === visiblePageNumber ? { ...asyncValueItem, value: loadedValue } : asyncValueItem
              })
            });
          });
          return [...acc, { page: visiblePageNumber, value: getLoadingPage(itemsOnPage[index]) }];
        }
      }, []);
      setAsyncValue(visibleValues);
    }
  }, [getCacheValue, addToCacheAndClean, visiblePageNumbers, page, loadPage, itemsPerPage, cacheSize, getLoadingPage, itemsOnPage]);

  const syncValue = value && visiblePageNumbers.reduce((acc, visiblePageNumber) => {
    let page = getCacheValue(visiblePageNumber);
    if (!page) {
      page = { page: visiblePageNumber, value: loadPageSync(visiblePageNumber, itemsPerPage) };
      addToCacheAndClean(visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []);

  return value ? syncValue : asyncValue;

};

export default useBufferedPages;