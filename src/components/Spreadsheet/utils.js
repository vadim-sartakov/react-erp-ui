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
        if (!lastGroup.end) lastGroup.end = toIndex;
      }
    };

    const levelDiff = curLevel - prevLevel;
    // Level increased
    if (levelDiff > 0) {
      curLevelGroups.push({ start: index });
    // Level decreased
    } else if (levelDiff < 0) {
      // Closing all currently opened groups
      closeGroups(prevLevel, curLevel, index - 1);
    }

    if (index === meta.length - 1) closeGroups(curLevel, 0, index);
    
  });

  // Applying hidden meta items
  const hiddenIndexes = meta.reduce((acc, meta, index) => meta && meta.hidden ? [...acc, index] : acc, []);

  groups = groups.map((levelGroups, level) => {
    let offset = 0;
    return levelGroups.reduce((acc, group) => {
      const hiddenCount = hiddenIndexes.reduce((acc, hiddenIndex) => {
        if (hiddenIndex >= group.start && hiddenIndex <= group.end) return acc + 1;
        else return acc;
      }, 0);
      const collapsed = hiddenCount > group.end - group.start ? true : undefined;

      const prevMeta = meta[group.start - 1];
      if (prevMeta && prevMeta.hidden) return acc;

      const offsetStart = group.start - offset;
      const offsetEnd = collapsed ? group.start : group.end - hiddenCount - offset;

      const result = {
        ...group,
        level: level + 1,
        offsetStart,
        offsetEnd,
        collapsed
      };
      offset += hiddenCount;
      return [...acc, result];
    }, [])
  });

  return groups;
};