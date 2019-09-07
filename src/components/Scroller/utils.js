const getItemSize = (meta, defaultSize, selfSize) => {
  if (meta && meta.children) {
    const values = [...new Array(meta.totalCount).keys()];
    const size = values.reduce((acc, arrayItem, index) => {
      const metaChild = meta.children[index];
      let result = acc;
      result += (metaChild && metaChild.size) || defaultSize;
      const childrenSize = metaChild.children ? getItemSize(metaChild.children, defaultSize) : 0;
      return result + childrenSize;
    }, selfSize);
    return size;
  } else {
    return (meta && meta.size) || defaultSize;
  }
};

export const getScrollPages = (meta, defaultSize, itemsPerPage) => {
  const values = [...new Array(meta.totalCount).keys()];
  const result = values.reduce(({ curPage, pages }, arrayItem, index) => {
    const metaChild = meta.children[index];
    const size = getItemSize(metaChild, defaultSize, (metaChild && metaChild.size) || defaultSize);
    const isNextPage = index > 0 && index % itemsPerPage === 0;
    const nextCurPage = isNextPage ?
        { start: curPage.end, end: curPage.end + size } :
        { start: curPage.start, end: curPage.end + size };
    const nextPages = isNextPage || index === 0 ? [...pages, nextCurPage] : pages;
    return {
      curPage: nextCurPage,
      pages: nextPages
    }
  }, {
    curPage: { start: 0, end: 0 },
    pages: []
  });
  return result.pages;
};

/**
 * Shifts start and end scroll borders by half of each page towards the array start.
 * Serves to simplify buffering.
 * @param {object} scrollPages - getScrollPages() result
 */
export const shiftScrollPages = scrollPages => {
  return scrollPages.reduce((acc, scrollPage, index) => {
    return [
      ...acc,
      {
        start: index === 0 ? scrollPage.start : acc[index - 1].end,
        end: scrollPage.start + Math.round((scrollPage.end - scrollPage.start) / 2)
      }
    ]
  }, []);
};

export const getPageNumberFromScrollPages = (scrollPages, scroll = 0) => {
  return scrollPages.findIndex(page => scroll >= page.start && scroll < page.end);
};

export const getPageNumberWithDefaultSize = (defaultSize, itemsPerPage, scroll) => {
  const pageSize = defaultSize * itemsPerPage;
  return Math.floor( ( scroll + pageSize / 2 ) / pageSize);
};

const getVisiblePages = page => page === 0 ? [0] : [page - 1, page];

export const getGapsWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, page }) => {
  const pageSize = defaultSize * itemsPerPage;
  const visiblePages = getVisiblePages(page);
  const startSectionSize = visiblePages[0] * pageSize;
  const totalPages = Math.floor(totalCount / itemsPerPage);
  const scrolledItems = page < totalPages ? ((visiblePages[1] || 0) + 1) * itemsPerPage : totalCount;
  const endSectionSize = (totalCount - scrolledItems) * defaultSize;
  return {
    start: startSectionSize,
    end: endSectionSize
  };
};

const gapsReducer = (acc, scrollPage) => acc + (scrollPage.end - scrollPage.start);

export const getGapsFromScrollPages = (scrollPages, page) => {
  const visiblePages = getVisiblePages(page);
  const startSectionSize = scrollPages.slice(0, visiblePages[0]).reduce(gapsReducer, 0);
  const endSectionSize = scrollPages.slice((visiblePages[1] || 0) + 1, scrollPages.lengh).reduce(gapsReducer, 0);
  return {
    start: startSectionSize,
    end: endSectionSize
  }
};