export const getVisiblePages = page => page === 0 ? [0] : [page - 1, page];
export const getTotalPages = (totalCount, itemsPerPage) => Math.ceil(totalCount / itemsPerPage);
export const getItemsOnPage = (page, itemsPerPage, totalCount) => {
  if (page === undefined) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  return page < totalPages - 1 ? itemsPerPage : totalCount - (page * itemsPerPage);
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
          start: curPage.end + selfSize,
          end: curPage.end + selfSize + childrenSize
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

const inRange = (scroll, range) => scroll >= range.start && scroll < range.end;

export const getPageNumberFromScrollPages = (scrollPages, scroll = 0) => {
  if (scroll < 0) return 0;

  const lastPageIndex = scrollPages.length - 1;
  if (scroll > scrollPages[lastPageIndex].end) return lastPageIndex;

  const currentPage = scrollPages.reduce((acc, page, index) => {
    if (acc !== -1) return acc;

    const isInRange = inRange(scroll, page);
    if (!isInRange) return acc;

    const onChildren = page.children && page.children.some(child => inRange(scroll, child));
    if (onChildren) return acc;

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