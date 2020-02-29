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

function applyStartOverscroll(startIndex, overscroll = 0) {
  return Math.max(startIndex - overscroll, 0);
};

function applyEndOverscroll(endIndex, totalCount, overscroll = 0) {
  return Math.min(endIndex + overscroll, totalCount - 1);
};

function getVisibleIndexesRange(startIndex, endIndex) {
  const result = [];
  for (let i = startIndex; i <= endIndex; i++) result.push(i);
  return result;
};

/**
 * @typedef ScrollData
 * @property {number} offset
 * @property {number[]} visibleIndexes
 */

/**
 * @param {Object} options
 * @param {number} options.containerSize
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @param {number} [options.overscroll=0]
 * @returns {ScrollData} 
 */
export function getScrollDataWithDefaultSize({ containerSize, defaultSize, totalCount, scroll, overscroll = 0 }) {
  const visibleElementsCount = Math.ceil(containerSize / defaultSize);
  const maxIndex = totalCount - 1;
  let firstIndex = Math.max(Math.floor(scroll / defaultSize), 0);
  let lastIndex = Math.min((firstIndex + visibleElementsCount) - 1, maxIndex);
  firstIndex = applyStartOverscroll(firstIndex, overscroll);
  lastIndex = applyEndOverscroll(lastIndex, totalCount, overscroll);
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex);
  const offset = defaultSize * firstIndex;
  const size = totalCount * defaultSize;
  return { offset, size, visibleIndexes };
};

export function getCustomSizesTotal({ sizes, totalCount, defaultSize }) {
  return [...new Array(totalCount).keys()].reduce((acc, key) => {
    const curSize = sizes[key] || defaultSize;
    return acc + curSize;
  }, 0);
};

/**
 * @param {Object} options
 * @param {number[]} options.sizes
 * @param {number} containerSize
 * @param {number} options.scroll
 * @param {number} options.defaultSize
 * @param {number} options.totalCount
 * @param {number} [options.overscroll=0]
 * @returns {ScrollData}
 */
export function getInitialScrollDataWithCustomSizes({ sizes, containerSize, defaultSize, totalCount, overscroll = 0 }) {
  const { offset, firstIndex } = findNextFirstIndexAndOffset({ startIndex: 0, startScroll: 0, targetScroll: 0, totalCount, sizes, defaultSize, overscroll });
  const lastIndex = findLastIndex({ targetScroll: 0, offset, firstIndex, sizes, totalCount, defaultSize, containerSize, overscroll });
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex);
  return { offset, visibleIndexes };
};

function findNextFirstIndexAndOffset({ startIndex, startScroll, targetScroll, sizes, totalCount, defaultSize, overscroll = 0 }) {
  let firstIndex, offset;
  let curIndex = startIndex;
  let curScroll = startScroll;
  let curOffset = startScroll;
  while (firstIndex === undefined && curIndex < totalCount) {
    const curSize = sizes[curIndex] || defaultSize;
    curScroll += curSize;
    if (curScroll >= targetScroll) {
      firstIndex = curIndex;
      offset = curOffset;
    }
    curOffset += curSize;
    curIndex++;
  }
  firstIndex = applyStartOverscroll(firstIndex, overscroll);
  return { firstIndex, offset };
};

function findPrevFirstIndexAndOffset({ startIndex, startScroll, targetScroll, sizes, defaultSize, overscroll = 0 }) {
  let firstIndex, offset;
  let curIndex = startIndex;
  let curScroll = startScroll;
  while (firstIndex === undefined && curIndex > 0) {
    const curSize = sizes[curIndex] || defaultSize;
    curScroll -= curSize;
    if (curScroll <= targetScroll) {
      firstIndex = curIndex;
      offset = curScroll;
    }
    curIndex--;
  }
  firstIndex = applyStartOverscroll(firstIndex, overscroll);
  return { firstIndex, offset };
};

function findLastIndex({ targetScroll, offset, firstIndex, sizes, totalCount, defaultSize, containerSize, overscroll = 0 }) {
  let lastIndex;
  let curIndex = firstIndex;
  let curOffset = offset;
  while (lastIndex === undefined && curIndex < totalCount) {
    const curSize = sizes[curIndex] || defaultSize;
    curOffset += curSize;
    if (curOffset >= targetScroll + containerSize) lastIndex = curIndex;
    curIndex++;
  }
  lastIndex = applyEndOverscroll(lastIndex, totalCount, overscroll);
  return lastIndex;
};

function shiftScrollBackward({ startIndex, startOffset, targetScroll, sizes, defaultSize, totalCount, containerSize, overscroll = 0 }) {
  const curSize = sizes[startIndex] || defaultSize;
  const { offset, firstIndex } = findPrevFirstIndexAndOffset({ startIndex, startScroll: startOffset + curSize, targetScroll, sizes, defaultSize, overscroll });
  const lastIndex = findLastIndex({ targetScroll, offset, firstIndex, sizes, totalCount, defaultSize, containerSize, overscroll });
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex);
  return { offset, visibleIndexes };
};

function shiftScrollForward({ startIndex, startOffset, targetScroll, sizes, defaultSize, totalCount, containerSize, overscroll = 0 }) {
  const { offset, firstIndex } = findNextFirstIndexAndOffset({ startIndex, startScroll: startOffset, targetScroll, totalCount, sizes, defaultSize, overscroll });
  const lastIndex = findLastIndex({ targetScroll, offset, firstIndex, sizes, totalCount, defaultSize, containerSize, overscroll });
  const visibleIndexes = getVisibleIndexesRange(firstIndex, lastIndex);
  return { offset, visibleIndexes };
};

export function shiftScroll({ prevScrollData, prevScroll, sizes, scroll, containerSize, totalCount, defaultSize, overscroll = 0 }) {
  const scrollDiff = scroll - prevScroll;
  const firstPrevIndex = prevScrollData.visibleIndexes[0];

  if (scrollDiff > 0) {
    const { offset, visibleIndexes } = shiftScrollForward({
      startIndex: firstPrevIndex,
      startOffset: prevScrollData.offset,
      targetScroll: scroll,
      sizes,
      defaultSize,
      scroll,
      containerSize,
      totalCount,
      overscroll
    });
    return { offset, visibleIndexes };
  } else if (scrollDiff < 0) {
    const { offset, visibleIndexes } = shiftScrollBackward({
      startIndex: firstPrevIndex,
      startOffset: prevScrollData.offset,
      targetScroll: scroll,
      sizes,
      defaultSize,
      totalCount,
      containerSize,
      overscroll
    });
    return { offset, visibleIndexes };
  } else {
    return prevScrollData;
  }
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