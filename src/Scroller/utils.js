/**
 * @typedef ScrollPage
 * @property {number} start
 * @property {number} end
 */

export const getVisiblePages = page => page === 0 ? [0, 1] : [page - 1, page];
export const getTotalPages = (totalCount, itemsPerPage) => Math.ceil(totalCount / itemsPerPage);

/**
 * @function
 * @param {number} page 
 * @param {number} itemsPerPage 
 * @param {number} totalCount
 * @returns {number}
 */
export const getItemsCountOnPage = (page, itemsPerPage, totalCount) => {
  if (page === undefined) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  if (page >= totalPages) return 0;
  return page < totalPages - 1 ? itemsPerPage : totalCount - (page * itemsPerPage);
};

/**
 * Creates scroll page object structure.
 * It helps to find current page depending on scroll position
 * @function
 * @param {Object} options
 * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
 * @param {number} options.defaultSize 
 * @param {number} options.itemsPerPage 
 * @returns {ScrollPage[]} [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
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

/**
 * @function
 * @param {ScrollPage[]} scrollPages [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
 * @param {number} [scroll=0]
 * @returns {number}
 */
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

/**
 * @function
 * @param {Object} options
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @returns {number} 
 */
export const getPageNumberWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, scroll }) => {
  if (scroll < 0) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  const pageSize = defaultSize * itemsPerPage;
  const page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
  return Math.min(totalPages - 1, page);
};

/**
 * Generic page number calculation function which decides how page number
 * will be calculated depending on whether meta option is specified or not
 * @function
 * @param {Object} options
 * @param {ScrollPage} options.scrollPages
 * @param {Meta[]} options.meta
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.scroll
 */
export const getPageNumber = ({ scrollPages, defaultSize, itemsPerPage, totalCount, scroll }) => {
  let curPage;
  if (scrollPages && scrollPages.length) {
    curPage = getPageNumberFromScrollPages(scrollPages, scroll);
  } else {
    curPage = getPageNumberWithDefaultSize({ defaultSize, itemsPerPage, totalCount, scroll });
  }
  return curPage;
};

/**
 * @typedef {Object} Gaps
 * @property {number} start 
 * @property {number} middle 
 * @property {number} end 
 */

/**
 * @function
 * @param {Object} options
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */
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

/**
 * @function
 * @param {Object} options
 * @param {ScrollPage[]} options.scrollPages [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */
export const getGapsFromScrollPages = ({ scrollPages, page }) => {
  const [startPage, endPage] = getVisiblePages(page);

  const startSectionSize = scrollPages.slice(0, startPage).reduce(gapsReducer, 0);
  const middleSectionSize = scrollPages.slice(startPage, endPage + 1).reduce(gapsReducer, 0);
  const endSectionSize = scrollPages.slice(endPage + 1, scrollPages.length).reduce(gapsReducer, 0);

  return {
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  }
};

/**
 * Generic function which calculates gaps depending on whether meta is specified or not.
 * @function
 * @param {Object} options
 * @param {ScrollPage} options.scrollPages
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */
export const getGaps = ({ scrollPages, defaultSize, itemsPerPage, totalCount, page }) => {
  let gaps;
  if (scrollPages && scrollPages.length) {
    gaps = getGapsFromScrollPages({ scrollPages, page });
  } else {
    gaps = getGapsWithDefaultSize({ defaultSize, itemsPerPage, totalCount, page });
  }
  return gaps;
};

 /**
  * @function
  * @param {Object} options
  * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
  * @param {number} options.defaultSize
  * @param {number} options.fixed - Number of fixed items
  * @returns {number[]}
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

/**
 * @function
 * @param {Object} options
 * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
 * @param {number} options.defaultSize
 * @returns {number}
 */
export const getItemsSize = ({ startIndex = 0, meta, count, defaultSize }) => {
  if (!count) return 0;
  return meta ? [...new Array(count).keys()].reduce((acc, key, index) => {
    const curMeta = meta[index + startIndex];
    const curSize = (curMeta && curMeta.size) || defaultSize;
    return acc + curSize;
  }, 0) : count * defaultSize;
};

/**
 * Gets items from the source values
 * @function
 * @param {Object[]} value 
 * @param {number} page 
 * @param {number} itemsPerPage
 * @returns {Object[]}
 */
export const loadPage = (value, page, itemsPerPage) => value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);