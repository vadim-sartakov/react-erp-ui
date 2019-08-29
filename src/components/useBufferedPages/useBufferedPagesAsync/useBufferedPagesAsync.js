import { useState, useRef, useEffect } from 'react';

const getVisiblePageNumbers = page => page === 0 ? [page] : [page - 1, page];

const useBufferedPagesAsync = (page, itemsPerPage, loadPage, cacheSize = 3) => {

  const cache = useRef([]);
  const [visiblePages, setVisiblePages] = useState(getVisiblePageNumbers(page).map(pageNumber => ({ page: pageNumber, isLoading: true })));
  useEffect(() => {
    const getCacheValue = page => cache.current.find(item => item && item.page === page);

    const visibleValues = getVisiblePageNumbers(page).reduce((acc, visiblePageNumber) => {
      let cachedPage = getCacheValue(visiblePageNumber);
      if (cachedPage) {
        return [...acc, cachedPage];
      } else {
        loadPage(visiblePageNumber, itemsPerPage).then(loadedPage => {
          cache.current.push({ page: visiblePageNumber, value: loadedPage});
          if (cache.current.length > cacheSize) cache.current.shift();
          setVisiblePages(visiblePages => {
            return visiblePages.map(visiblePage => {
              return visiblePage.page === visiblePageNumber ? { ...visiblePage, value: loadedPage } : visiblePage
            })
          });
        });
        return [...acc, { page: visiblePageNumber, isLoading: true }];
      }
    }, []);
    setVisiblePages(visibleValues);
  }, [page, loadPage, itemsPerPage, cacheSize]);

  return visiblePages;

};

export default useBufferedPagesAsync;