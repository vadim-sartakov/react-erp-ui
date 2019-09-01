import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const loadPageSync = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
const getCacheValue = (cache, page) => cache.current.find(item => item && item.page === page);
const addToCacheAndClean = (cache, cacheSize, page, value) => {
  cache.current.push({ page, value });
  if (cache.current.length > cacheSize) cache.current.shift();
};

const useBufferedPages = ({ value, page, itemsPerPage, loadPage, cacheSize = 3 }) => {

  const visiblePageNumbers = useMemo(() => page === 0 ? [page] : [page - 1, page], [page]);

  const getLoadingPage = useCallback((totalCount, visiblePageNumber, index) => {
    const itemsOnFirstPage = Math.min(totalCount, itemsPerPage);
    const itemsOnSecondPage = page > 0 ? Math.min(Math.max(totalCount - (page * itemsPerPage), 0), itemsPerPage) : 0;
    const itemsOnPages = [itemsOnFirstPage, itemsOnSecondPage];
    const itemsOnPage = itemsOnPages[index];
    const value = [...new Array(itemsOnPage).keys()].map(() => ({ isLoading: true }));
    return { page: visiblePageNumber, value };
  }, [page, itemsPerPage]);

  const defaultTotalCount = useMemo(() => (value && value.length) || itemsPerPage * 2, [value, itemsPerPage]);
  const getDefaultAsyncState = useCallback(() => {
    return visiblePageNumbers.map((visiblePageNumber, index) => {
      return getLoadingPage(defaultTotalCount, visiblePageNumber, index);
    })
  }, [defaultTotalCount, getLoadingPage, visiblePageNumbers]);
  const [asyncValue, setAsyncValue] = useState(loadPage ? {
    totalCount: defaultTotalCount,
    value: getDefaultAsyncState()
  } : {});

  const cache = useRef([]);

  useEffect(() => {
    if (loadPage) {
      const visibleValues = visiblePageNumbers.reduce((acc, visiblePageNumber, index) => {
        let cachedPage = getCacheValue(cache, visiblePageNumber);
        if (cachedPage) {
          return [...acc, cachedPage];
        } else {
          loadPage(visiblePageNumber, itemsPerPage).then(loadResult => {
            addToCacheAndClean(cache, cacheSize, visiblePageNumber, loadResult.value);
            setAsyncValue(asyncValue => {
              const visibleValue = asyncValue.value.map(asyncValueItem => {
                return asyncValueItem.page === visiblePageNumber ?
                    { page: visiblePageNumber, value: loadResult.value } :
                    asyncValueItem
              })
              return {
                totalCount: loadResult.totalCount,
                value: visibleValue
              }
            });
          });
          return [...acc, getLoadingPage(asyncValue.totalCount, visiblePageNumber, index)];
        }
      }, []);
      setAsyncValue(asyncValue => ({ ...asyncValue, value: visibleValues }));
    }
  }, [
    visiblePageNumbers,
    page,
    loadPage,
    itemsPerPage,
    cacheSize,
    getLoadingPage,
    asyncValue.totalCount
  ]);

  const syncValue = value && visiblePageNumbers.reduce((acc, visiblePageNumber) => {
    let page = getCacheValue(cache, visiblePageNumber);
    if (!page) {
      page = { page: visiblePageNumber, value: loadPageSync(value, visiblePageNumber, itemsPerPage) };
      addToCacheAndClean(cache, cacheSize, visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []);

  return value ? [syncValue, value.length] : [asyncValue.value, asyncValue.totalCount];

};

export default useBufferedPages;