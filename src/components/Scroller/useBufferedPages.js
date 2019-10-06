import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getItemsCountOnPage, getVisiblePages } from './utils';

export const loadPageSync = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
const getCacheValue = (cache, page) => cache.current.find(item => item && item.page === page);
const addToCacheAndClean = (cache, cacheSize, page, value) => {
  cache.current.push({ page, value });
  if (cache.current.length > cacheSize) cache.current.shift();
};

const setValueIndexes = (pageNumber, itemsPerPage, value) => {
  const index = pageNumber * itemsPerPage;
  return value.map((valueItem, itemIndex) => ({ index: index + itemIndex, ...valueItem }));
};

const useBufferedPages = ({ value, page, itemsPerPage, loadPage, totalCount, disableCache, cacheSize = 3 }) => {

  const visiblePageNumbers = useMemo(() => getVisiblePages(page), [page]);
  const getLoadingPage = useCallback(page => {
    if (loadPage) {
      const itemsOnPage = getItemsCountOnPage(page, itemsPerPage, totalCount);
      return [...new Array(itemsOnPage).keys()].map(() => ({ isLoading: true }));
    }
  }, [loadPage, itemsPerPage, totalCount]);
  const [asyncValue, setAsyncValue] = useState(
    loadPage ?
    visiblePageNumbers.map(pageNumber => ({ page: pageNumber, value: getLoadingPage(pageNumber) })) :
    undefined
  );
  
  const cache = useRef([]);

  useEffect(() => {
    if (loadPage) {
      const visibleValues = visiblePageNumbers.reduce((acc, visiblePageNumber) => {
        let cachedPage = !disableCache && getCacheValue(cache, visiblePageNumber);
        if (cachedPage) {
          return [...acc, cachedPage];
        } else {
          loadPage(visiblePageNumber, itemsPerPage).then(loadResult => {
            const pageValue = setValueIndexes(visiblePageNumber, itemsPerPage, loadResult);
            !disableCache && addToCacheAndClean(cache, cacheSize, visiblePageNumber, pageValue);
            setAsyncValue(asyncValue => {
              const visibleValue = asyncValue.map(asyncValueItem => {
                return asyncValueItem.page === visiblePageNumber ?
                    { page: visiblePageNumber, value: pageValue } :
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
    visiblePageNumbers,
    page,
    loadPage,
    getLoadingPage,
    itemsPerPage,
    cacheSize,
    disableCache
  ]);

  const syncValue = value && visiblePageNumbers.reduce((acc, visiblePageNumber) => {
    let page = !disableCache && getCacheValue(cache, visiblePageNumber);
    if (!page) {
      let pageValue = loadPageSync(value, visiblePageNumber, itemsPerPage);
      pageValue = setValueIndexes(visiblePageNumber, itemsPerPage, pageValue);
      page = { page: visiblePageNumber, value: pageValue };
      !disableCache && addToCacheAndClean(cache, cacheSize, visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []);

  return loadPage ? asyncValue : syncValue;

};

export default useBufferedPages;