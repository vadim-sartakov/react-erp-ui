 /**
  * Calculates groups object of meta value
  * @param {import('./').Meta[]} meta
  * @returns {import('./').Group[][]}
  */
export const getGroups = meta => {
  const groups = [];

  meta.forEach((metaItem, index, meta) => {
    const prevLevel = index > 0 ? (meta[index - 1] && meta[index - 1].level) || 0 : 0;
    const curLevel = metaItem.level || 0;

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

    if (index === meta.length - 1) closeGroups(prevLevel, 0, index);
    
  });

  return groups;
};