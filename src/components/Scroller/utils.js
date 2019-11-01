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
    if (acc.pageIndex !== -1) return acc;
    
    const pageSize = page.end - page.start;
    const pageHalf = pageSize / 2;
    const curScroll = acc.curScroll + pageSize;

    const isInRange = scroll >= page.start && scroll < page.end;
    if (!isInRange) return { ...acc, curScroll };

    const pageIndex = scroll > (page.start + pageHalf) ? index + 1 : index;

    return { curScroll, pageIndex };
  }, { curScroll: 0, pageIndex: -1 });
  return currentPage.pageIndex;
};

export const getPageNumberWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, scroll }) => {
  if (scroll < 0) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  const pageSize = defaultSize * itemsPerPage;
  const page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
  return Math.min(totalPages - 1, page);
};

export const getPageNumber = ({ meta, defaultSize, itemsPerPage, totalCount, scroll }) => {
  let curPage;
  if (meta && meta.length) {
    const scrollPages = getScrollPages({ meta, defaultSize, itemsPerPage, totalCount });
    curPage = getPageNumberFromScrollPages(scrollPages, scroll);
  } else {
    curPage = getPageNumberWithDefaultSize({ defaultSize, itemsPerPage, totalCount, scroll });
  }
  return curPage;
};

export const getGapsWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, page, fixed = 0 }) => {
  const pageSize = defaultSize * itemsPerPage;
  const visiblePages = getVisiblePages(page);
  const fixedSectionSize = fixed * defaultSize;
  const startSectionSize = visiblePages[0] * pageSize;
  const totalSize = totalCount * defaultSize;
  const visibleItems =
      getItemsCountOnPage(visiblePages[0], itemsPerPage, totalCount) +
      getItemsCountOnPage(visiblePages[1], itemsPerPage, totalCount);
  const visibleSectionSize = visibleItems * defaultSize;
  const endSectionSize = totalSize - (startSectionSize + visibleSectionSize);
  const middleSectionSize = totalSize - startSectionSize - endSectionSize;
  return {
    fixed: fixedSectionSize,
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  };
};

const gapsReducer = (acc, scrollPage) => acc + (scrollPage.end - scrollPage.start);

export const getGapsFromScrollPages = ({ scrollPages, page, fixed = 0 }) => {
  const visiblePages = getVisiblePages(page);
  const fixedSectionSize = scrollPages.slice(0, fixed).reduce(gapsReducer, 0);
  const startSectionSize = scrollPages.slice(0, visiblePages[0]).reduce(gapsReducer, 0);
  const middleSectionSize = scrollPages.slice(visiblePages[0], ((visiblePages[1] || 0) + 1)).reduce(gapsReducer, 0);
  const endSectionSize = scrollPages.slice((visiblePages[1] || 0) + 1, scrollPages.length).reduce(gapsReducer, 0);
  return {
    fixed: fixedSectionSize,
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  }
};

export const getGaps = ({ meta, defaultSize, itemsPerPage, totalCount, page, fixed }) => {
  let gaps;
  if (meta && meta.length) {
    const scrollPages = getScrollPages({ meta, totalCount, defaultSize, itemsPerPage });
    gaps = getGapsFromScrollPages({ scrollPages, page, fixed });
  } else {
    gaps = getGapsWithDefaultSize({ defaultSize, itemsPerPage, totalCount, page, fixed });
  }
  return gaps;
};

/**
 * @typedef getFixedOffsetsOptions
 * @property {Object} meta
 * @property {number} defaultSize
 * @property {number} fixed - Fixed items count
 */

 /**
 * @param {getFixedOffsetsOptions} options
 */
export const getFixedOffsets = ({ meta, defaultSize, fixed }) => {
  const resultOffset = [...new Array(fixed).keys()].reduce((acc, curKey, index) => {
    const curOffset = index === 0 ? 0 : [...new Array(index).keys()].reduce((acc, key, index) => {
      const curMeta = meta && meta[index];
      const offset = curMeta ? (curMeta.size || defaultSize) : defaultSize;
      return acc + offset;
    }, 0);
    return [...acc, curOffset];
  }, []);
  return resultOffset;
};

export const loadPage = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);