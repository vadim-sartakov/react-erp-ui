export const getVisiblePages = page => page === 0 ? [0] : [page - 1, page];
export const getTotalPages = (totalCount, itemsPerPage) => Math.ceil(totalCount / itemsPerPage);
export const getItemsOnPage = (page, itemsPerPage, totalCount) => {
  if (page === undefined) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  return page < totalPages - 1 ? itemsPerPage : totalCount - (page * itemsPerPage);
};

const childrenHaveValues = children => children.length && children.some(child => child !== undefined);

export const setSyncValueMetaTotalCounts = (value, meta = { totalCount: 0 }) => {
  return Object.entries(meta).reduce((acc, [metaKey, metaValue]) => {
    const children = value.reduce((acc, valueItem, index) => {
      const curMeta = meta.children && meta.children[index];
      let result;
      if (valueItem.children) {
        result = {
          ...curMeta,
          totalCount: valueItem.children.length
        };
        const children = setSyncValueMetaTotalCounts(valueItem.children, curMeta);
        if (childrenHaveValues(children)) result.children = children;
      } else {
        result = curMeta;
      }
      return [...acc, result];
    }, []);
    const result = {
      ...acc,
      [metaKey]: metaValue,
      totalCount: value.length
    };
    if (childrenHaveValues(children)) result.children = children;
    return result;
  }, {});
};

const getSelfSize = (meta, defaultSize) => (meta && meta.size) || defaultSize;

const getChilrenSize = (meta, defaultSize) => {
  if (meta && meta.expanded) {
    const values = [...new Array(meta.totalCount).keys()];
    const size = values.reduce((acc, arrayItem, index) => {
      const metaChild = meta.children && meta.children[index];
      let result = acc;
      const selfSize = getSelfSize(metaChild, defaultSize);
      result += selfSize;
      const childrenSize = metaChild && metaChild.children ? getChilrenSize(metaChild, defaultSize) : 0;
      return result + childrenSize;
    }, 0);
    return size;
  } else {
    return 0;
  }
};

export const getScrollPages = (meta, defaultSize, itemsPerPage) => {
  const values = [...new Array(meta.totalCount).keys()];
  const result = values.reduce(({ curPage, pages }, arrayItem, index, values) => {
    const metaChild = meta.children[index];

    const selfSize = getSelfSize(metaChild, defaultSize);
    const childrenSize = getChilrenSize(metaChild, defaultSize);
    const isNextPage = index > 0 && index % itemsPerPage === 0;
    
    let nextPages = isNextPage ? [...pages, curPage] : pages;
    const nextCurPage = {
      ...curPage,
      end: curPage.end + selfSize + childrenSize
    };
    if (isNextPage) {
      nextCurPage.start = curPage.end;
      delete nextCurPage.children
    }
    if (childrenSize) {
      nextCurPage.children = [
        ...(curPage.children || []),
        {
          start: curPage.start + curPage.end + selfSize,
          end: curPage.start + curPage.end + selfSize + childrenSize
        }
      ];
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

export const getGapsWithDefaultSize = ({ defaultSize, itemsPerPage, totalCount, page }) => {
  const pageSize = defaultSize * itemsPerPage;
  const visiblePages = getVisiblePages(page);
  const startSectionSize = visiblePages[0] * pageSize;
  const totalSize = totalCount * defaultSize;
  const visibleItems =
      getItemsOnPage(visiblePages[0], itemsPerPage, totalCount) +
      getItemsOnPage(visiblePages[1], itemsPerPage, totalCount);
  const visibleSectionSize = visibleItems * defaultSize;
  const endSectionSize = totalSize - (startSectionSize + visibleSectionSize);
  return {
    start: startSectionSize,
    end: endSectionSize
  };
};

const gapsReducer = (acc, scrollPage) => acc + (scrollPage.end - scrollPage.start);

export const getGapsFromScrollPages = (scrollPages, page) => {
  const visiblePages = getVisiblePages(page);
  const startSectionSize = scrollPages.slice(0, visiblePages[0]).reduce(gapsReducer, 0);
  const endSectionSize = scrollPages.slice((visiblePages[1] || 0) + 1, scrollPages.length).reduce(gapsReducer, 0);
  return {
    start: startSectionSize,
    end: endSectionSize
  }
};