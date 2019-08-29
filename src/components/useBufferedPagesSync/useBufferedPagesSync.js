import { useRef } from 'react';

const loadPage = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

const useBufferedPagesSync = (value, page, itemsPerPage) => {

  // useEffect here will make it laggy
  // So using local variables
  const cache = useRef([]);
  const visiblePages = page === 0 ? [page] : [page - 1, page];

  const getCacheValue = page => cache.current.find(item => item && item.page === page);

  const visibleValues = visiblePages.reduce((acc, visiblePage) => {
    let cachedPage = getCacheValue(visiblePage);
    if (!cachedPage) {
      const newPage = { page: visiblePage, value: loadPage(value, visiblePage, itemsPerPage) };
      cache.current.push(newPage);
      cachedPage = newPage;
      if (cache.length > 2) cache.current.shift();
    }
    return [...acc, ...cachedPage.value]
  }, []);

  return visibleValues;

};

export default useBufferedPagesSync;