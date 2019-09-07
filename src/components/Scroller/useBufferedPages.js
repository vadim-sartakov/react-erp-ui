import { useState, useRef, useEffect, useMemo } from 'react';
import { getItemsOnPage, getVisiblePages } from './utils';

export const loadPageSync = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
const getCacheValue = (cache, page) => cache.current.find(item => item && item.page === page);
const addToCacheAndClean = (cache, cacheSize, page, value) => {
  cache.current.push({ page, value });
  if (cache.current.length > cacheSize) cache.current.shift();
};

const useBufferedPages = ({ value, page, itemsPerPage, loadPage, cacheSize = 3 }) => {

  const visiblePageNumbers = useMemo(() => getVisiblePages(page), [page]);
  const loadingPage = useMemo(() => {
    if (loadPage) {
      const itemsOnPage = getItemsOnPage(page, itemsPerPage);
      return [...new Array(itemsOnPage).keys()].map(() => ({ isLoading: true }));
    }
  }, [loadPage, itemsPerPage, page]);
  const [asyncValue, setAsyncValue] = useState(loadPage ? loadingPage : undefined);
  
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
              return visibleValue;
            });
          });
          return [...acc, { page: visiblePageNumber, value: loadingPage }];
        }
      }, []);
      setAsyncValue(asyncValue => ({ ...asyncValue, value: visibleValues }));
    }
  }, [
    visiblePageNumbers,
    page,
    loadPage,
    loadingPage,
    itemsPerPage,
    cacheSize
  ]);

  const syncValue = value && visiblePageNumbers.reduce((acc, visiblePageNumber) => {
    let page = getCacheValue(cache, visiblePageNumber);
    if (!page) {
      page = { page: visiblePageNumber, value: loadPageSync(value, visiblePageNumber, itemsPerPage) };
      addToCacheAndClean(cache, cacheSize, visiblePageNumber, page.value);
    }
    return [...acc, page]
  }, []);

  return loadPage ? asyncValue : syncValue;

};

export default useBufferedPages;