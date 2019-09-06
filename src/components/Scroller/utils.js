const getItemSize = (meta, defaultSize, selfSize) => {
  if (!meta || !meta.children) {
    return defaultSize;
  } else {
    const values = [...new Array(meta.children.length).keys()];
    const size = values.reduce((acc, arrayItem, index) => {
      const metaChild = meta.children[index];
      let result = acc;
      result += (metaChild && metaChild.size) || defaultSize;
      const childrenSize = metaChild.children ? getItemSize(metaChild.children, defaultSize) : 0;
      return result + childrenSize;
    }, selfSize);
    return size;
  }
};

export const getScrollPages = (meta, defaultSize, itemsPerPage) => {
  const values = [...new Array(meta.children.length).keys()];
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