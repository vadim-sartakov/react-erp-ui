import { getCellsRangeSize, getCellPosition } from "../grid/MergedCell/utils";

/**
 * @param {number} totalCount 
 * @param {number} itemsPerPage 
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

function getVisibleIndexesRange(startIndex, endIndex, totalCount, overscroll) {
  const firstIndex = Math.max(startIndex - overscroll, 0);
  const lastIndex = Math.min(endIndex + overscroll, totalCount - 1);
  const result = [];
  for (let i = firstIndex; i <= lastIndex; i++) result.push(i);
  return result;
};

/**
 * @typedef ScrollData
 * @property {number} offset
 * @property {number} size
 * @property {number[]} visibleIndexes
 */

/**
 * @param {Object} options
 * @param {number} options.containerSize
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @param {number=0} options.overscroll
 * @returns {ScrollData} 
 */
export function getScrollDataWithDefaultSize({ containerSize, defaultSize, totalCount, scroll, overscroll = 0 }) {
  const visibleElementsCount = Math.ceil(containerSize / defaultSize);
  const maxIndex = totalCount - 1;
  let firstIndex = Math.max(Math.floor(scroll / defaultSize), 0);
  let lastIndex = Math.min((firstIndex + visibleElementsCount) - 1, maxIndex);
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex, totalCount, overscroll);
  const offset = defaultSize * firstIndex;
  const size = totalCount * defaultSize;
  return { offset, size, visibleIndexes };
};

/**
 * @param {Object} options
 * @param {number[]} options.sizes
 * @param {number} containerSize
 * @param {number} options.scroll
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 * @param {number} [options.overscroll=0]
 * @returns {number[]}
 */
export function getScrollDataWithCustomSizes({ sizes, containerSize, scroll, defaultSize, totalCount, overscroll = 0 }) {
  let curScroll = 0;
  let size = 0;

  let firstIndex, lastIndex, offset;
  for (let curIndex = 0; curIndex < totalCount; curIndex++) {
    const curSize = sizes[curIndex] || defaultSize;

    curScroll += curSize;
    size += curSize;

    if (firstIndex === undefined && curScroll >= scroll) {
      firstIndex = curIndex;
      offset = curScroll - curSize;
    }
    if (lastIndex === undefined && curScroll >= (scroll + containerSize)) lastIndex = curIndex;
  }
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex, totalCount, overscroll);
  return { offset, size, visibleIndexes };
};

export function getRelativeScrollData({ prevScrollData, prevScroll, scroll, defaultSize, totalCount, overscroll = 0 }) {

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