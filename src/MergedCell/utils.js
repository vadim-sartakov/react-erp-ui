/**
 * Calculates cell position (top and left absolute position)
 * @param {Object} options
 * @param {import('./').Meta} options.meta
 * @param {number} options.index
 * @param {number} options.defaultSize
 */
export const getCellPosition = ({ meta = [], index, defaultSize }) => {
  return [...new Array(index).keys()].reduce((acc, key, index) => {
    const curMeta = meta[index];
    const curSize = (curMeta && curMeta.size) || defaultSize;
    return acc + curSize;
  }, 0);
};

/**
 * Calculates merged cells size (width and height)
 * @param {Object} options
 * @param {number} options.count
 * @param {import('./').Meta} options.meta
 * @param {number} options.startIndex
 * @param {number} options.defaultSize
 */
export const getCellsRangeSize = ({ count, meta = [], startIndex = 0, defaultSize }) => {
  return count && [...new Array(count).keys()].reduce((acc, key, index) => {
    const mergedMeta = meta[startIndex + index];
    const size = (mergedMeta && mergedMeta.size) || defaultSize;
    return acc + size;
  }, 0);
};