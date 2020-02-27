import { getCellsRangeSize, getCellPosition } from "../grid/MergedCell/utils";

/**
 * @typedef Meta
 * @property {number} size
 */

export function getTotalPages(totalCount, itemsPerPage){
  return Math.ceil(totalCount / itemsPerPage);
};

/**
 * @param {number} page 
 * @param {number} itemsPerPage 
 * @param {number} totalCount
 * @returns {number}
 */
export function getItemsCountOnPage(page, itemsPerPage, totalCount) {
  if (page === undefined) return 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  if (page >= totalPages) return 0;
  return page < totalPages - 1 ? itemsPerPage : totalCount - (page * itemsPerPage);
};

/**
 * @param {Object} options
 * @param {number} containerSize
 * @param {number[]} options.sizes
 * @param {number} options.scroll
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 */
export function getVisibleIndexesWithCustomSizes({ containerSize, sizes, scroll, defaultSize, totalCount, overscroll = 0 }) {
  let curScroll = 0;
  let firstIndex, lastIndex;
  for (let curIndex = 0; curIndex < totalCount; curIndex++) {
    curScroll += sizes[curIndex] || defaultSize;
    if (firstIndex === undefined && curScroll >= scroll) firstIndex = curIndex;
    if (lastIndex === undefined && curScroll >= (scroll + containerSize)) {
      lastIndex = curIndex;
      break;
    }
  }
  firstIndex = Math.max(firstIndex - overscroll, 0);
  lastIndex = Math.min(lastIndex + overscroll, totalCount - 1);
  const result = [];
  for (let i = firstIndex; i <= lastIndex; i++) result.push(i);
  return result;
};

/**
 * @param {Object} options
 * @param {number} options.containerSize
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @param {number} options.overscroll
 * @returns {number} 
 */
export function getVisibleIndexesWithDefaultSizes({ containerSize, defaultSize, totalCount, scroll, overscroll = 0 }) {
  const visibleElementsCount = Math.ceil(containerSize / defaultSize);
  const maxIndex = totalCount - 1;
  let firstIndex = Math.max(Math.floor(scroll / defaultSize), 0);
  let lastIndex = Math.min((firstIndex + visibleElementsCount) - 1, maxIndex);
  firstIndex = Math.max(firstIndex - overscroll, 0);
  lastIndex = Math.min(lastIndex + overscroll, maxIndex);
  const result = [];
  for (let i = firstIndex; i <= lastIndex; i++) result.push(i);
  return result;
};

/**
 * Generic visible indexes calculation function which decides how indexes
 * will be calculated depending on whether meta option is specified or not
 * @function
 * @param {Object} options
 * @param {ScrollPage} options.scrollPages
 * @param {Meta[]} options.meta
 * @param {number} options.defaultSize
 * @param {number} options.containerSize
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @param {number} options.overscroll
 */
export const getVisibleIndexes = ({ scrollPages, defaultSize, totalCount, containerSize, scroll, overscroll = 0 }) => {
  let visibleIndexes;
  if (scrollPages && scrollPages.length) {
    visibleIndexes = getVisibleIndexesWithCustomSizes(scrollPages, scroll);
  } else {
    visibleIndexes = getVisibleIndexesWithDefaultSizes({ defaultSize, containerSize, totalCount, scroll, overscroll });
  }
  return visibleIndexes;
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

export const getOverscrolledCoordinateOffset = ({ coordinate, containerSize, fixedSize }) => {
  const startOverscroll = coordinate - fixedSize;
  const endOverscroll = coordinate - containerSize;
  if (startOverscroll < 0) return startOverscroll;
  else if (endOverscroll > 0) return endOverscroll;
};

export const getOverscrolledCellOffset = ({
  rows,
  columns,
  defaultRowHeight,
  defaultColumnWidth,
  rowIndex,
  columnIndex,
  fixRows,
  fixColumns,
  scrollTop,
  scrollLeft,
  containerWidth,
  containerHeight
}) => {
  let x = getCellPosition({ meta: columns, index: columnIndex, defaultSize: defaultColumnWidth });
  let y = getCellPosition({ meta: rows, index: rowIndex, defaultSize: defaultRowHeight });

  const relativeX = x - scrollLeft;
  const relativeY = y - scrollTop;

  const fixedRowsSize = getCellsRangeSize({ startIndex: 0, meta: rows, count: fixRows, defaultSize: defaultRowHeight }) || 0;
  const fixedColumnsSize = getCellsRangeSize({ startIndex: 0, meta: columns, count: fixColumns, defaultSize: defaultColumnWidth }) || 0;

  const height = (rows && rows[rowIndex] && rows[rowIndex].size) || defaultRowHeight;
  const width = (columns && columns[columnIndex] && columns[columnIndex].size) || defaultColumnWidth;

  if ((y + height) >= y && relativeY > fixedRowsSize) y += height;
  if ((x + width) >= x && relativeX > fixedColumnsSize) x += width;

  x -= scrollLeft;
  y -= scrollTop;

  const overscrollLeft = getOverscrolledCoordinateOffset({ coordinate: x, containerSize: containerWidth, fixedSize: fixedColumnsSize });
  const overscrollTop = getOverscrolledCoordinateOffset({ coordinate: y, containerSize: containerHeight, fixedSize: fixedRowsSize });

  return { overscrollLeft, overscrollTop };
};