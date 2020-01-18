/**
 * Calculates merged cell position (top and left absolute position)
 * @param {Object} options
 * @param {import('./').Meta} options.meta
 * @param {number} options.index
 * @param {number} options.defaultSize
 */
export const getMergedCellPosition = ({ meta = [], index, defaultSize }) => {
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
export const getCellsRangeSize = ({ count, meta = [], startIndex, defaultSize }) => {
  return count && [...new Array(count).keys()].reduce((acc, key, index) => {
    const mergedMeta = meta[startIndex + index];
    const size = (mergedMeta && mergedMeta.size) || defaultSize;
    return acc + size;
  }, 0);
};
 
/**
  * Calculates groups object of meta value
  * @param {import('./').Meta[]} meta
  * @returns {import('./').Group[][]}
  */
export const getGroups = meta => {
  let groups = [];

  [...new Array(meta.length).keys()].forEach((key, index) => {
    const metaItem = meta[index];
    const prevLevel = index > 0 ? (meta[index - 1] && meta[index - 1].level) || 0 : 0;
    const curLevel = (metaItem && metaItem.level) || 0;

    // Initializing groups of current level if there is no any
    let curLevelGroups;
    if (curLevel > 0) {
      if (!groups[curLevel - 1]) groups[curLevel - 1] = [];
      curLevelGroups = groups[curLevel - 1];
    }

    const closeGroups = (fromLevel, toLevel, toIndex) => {
      for (let i = fromLevel; i > toLevel; i--) {
        const curLevelGroups = groups[i - 1];
        const lastGroup = curLevelGroups[curLevelGroups.length - 1];
        
        const prevMeta = meta[lastGroup.start - 1];
        if (prevMeta && prevMeta.hidden) {
          curLevelGroups.pop();
          continue;
        }

        if (!lastGroup.end) lastGroup.end = toIndex;

        const offsetReducer = (acc, metaItem) => metaItem && metaItem.hidden ? acc + 1 : acc;

        const startOffset = meta.slice(0, lastGroup.start).reduce(offsetReducer, 0);
        const endOffset = meta.slice(lastGroup.start, toIndex + 1).reduce(offsetReducer, 0);

        const collapsed = endOffset && endOffset === (lastGroup.end - lastGroup.start) + 1;
        lastGroup.offsetStart = lastGroup.start - startOffset;
        lastGroup.offsetEnd = collapsed ? lastGroup.offsetStart : lastGroup.end - startOffset - endOffset;

        if (collapsed) lastGroup.collapsed = true;
      }
    };

    const levelDiff = curLevel - prevLevel;
    // Level increased
    if (levelDiff > 0) {
      curLevelGroups.push({ start: index, level: curLevel });
    // Level decreased
    } else if (levelDiff < 0) {
      // Closing all currently opened groups
      closeGroups(prevLevel, curLevel, index - 1);
    }

    if (index === meta.length - 1) closeGroups(curLevel, 0, index);
    
  });

  return groups;
};