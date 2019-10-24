export const getVisiblePages = page => page === 0 ? [0, 1] : [page - 1, page];
export const getTotalPages = (totalCount, itemsPerPage) => Math.ceil(totalCount / itemsPerPage);

export const getItemsCountOnPage = (page, itemsPerPage, totalCount) => {
  if (page === undefined) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  return page < totalPages - 1 ? itemsPerPage : totalCount - (page * itemsPerPage);
};

/**
 * Creates scroll page object structure
 * It helps to find current page depending on scroll position
 * @param {*} meta 
 * @param {*} defaultSize 
 * @param {*} itemsPerPage 
 */
export const getScrollPages = ({ meta, totalCount, defaultSize, itemsPerPage }) => {
  const values = [...new Array(totalCount).keys()];
  const result = values.reduce(({ curPage, pages }, arrayItem, index, values) => {
    const curMeta = meta && meta[index];

    const selfSize = ( curMeta && curMeta.size ) || defaultSize;
    const isNextPage = index > 0 && index % itemsPerPage === 0;
    
    let nextPages = isNextPage ? [...pages, curPage] : pages;
    const nextCurPage = {
      ...curPage,
      end: curPage.end + selfSize
    };
    if (isNextPage) {
      nextCurPage.start = curPage.end;
      delete nextCurPage.children
    }
    
    if (index === values.length - 1) nextPages = [...nextPages, nextCurPage];
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

export const getPageNumberFromScrollPages = (scrollPages, scroll = 0) => {
  if (scroll < 0) return 0;

  const lastPageIndex = scrollPages.length - 1;
  if (scroll > scrollPages[lastPageIndex].end) return lastPageIndex;

  const currentPage = scrollPages.reduce((acc, page, index) => {
    if (acc !== -1) return acc;

    const isInRange = scroll >= page.start && scroll < page.end;
    if (!isInRange) return acc;

    const pageSize = page.end - page.start;
    const pageHalf = pageSize / 2;

    return scroll > pageHalf ? index + 1 : index;
  }, -1);
  return currentPage;
};

export const getPageNumberWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, scroll }) => {
  if (scroll < 0) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  const pageSize = defaultSize * itemsPerPage;
  const page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
  return Math.min(totalPages - 1, page);
};

export const getPageNumber = ({ sizes, defaultSize, itemsPerPage, totalCount, scroll }) => {
  let curPage;
  if (sizes && sizes.length) {
    const scrollPages = getScrollPages({ meta: sizes, defaultSize, itemsPerPage, totalCount });
    curPage = getPageNumberFromScrollPages(scrollPages, scroll);
  } else {
    curPage = getPageNumberWithDefaultSize({ defaultSize, itemsPerPage, totalCount, scroll });
  }
  return curPage;
};

export const getGapsWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, page }) => {
  const pageSize = defaultSize * itemsPerPage;
  const visiblePages = getVisiblePages(page);
  const startSectionSize = visiblePages[0] * pageSize;
  const totalSize = totalCount * defaultSize;
  const visibleItems =
      getItemsCountOnPage(visiblePages[0], itemsPerPage, totalCount) +
      getItemsCountOnPage(visiblePages[1], itemsPerPage, totalCount);
  const visibleSectionSize = visibleItems * defaultSize;
  const endSectionSize = totalSize - (startSectionSize + visibleSectionSize);
  const middleSectionSize = totalSize - startSectionSize - endSectionSize;
  return {
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  };
};

const gapsReducer = (acc, scrollPage) => acc + (scrollPage.end - scrollPage.start);

export const getGapsFromScrollPages = (scrollPages, page) => {
  const visiblePages = getVisiblePages(page);
  const startSectionSize = scrollPages.slice(0, visiblePages[0]).reduce(gapsReducer, 0);
  const middleSectionSize = scrollPages.slice(visiblePages[0], ((visiblePages[1] || 0) + 1)).reduce(gapsReducer, 0);
  const endSectionSize = scrollPages.slice((visiblePages[1] || 0) + 1, scrollPages.length).reduce(gapsReducer, 0);
  return {
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  }
};

export const getGaps = ({ sizes, defaultSize, itemsPerPage, totalCount, page }) => {
  let gaps;
  if (sizes && sizes.length) {
    const scrollPages = getScrollPages({ meta: sizes, totalCount, defaultSize, itemsPerPage });
    gaps = getGapsFromScrollPages(scrollPages, page);
  } else {
    gaps = getGapsWithDefaultSize({ defaultSize, itemsPerPage, totalCount, page });
  }
  return gaps;
};

export const loadPage = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);