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

const convertRangeToRect = (mergedRange) => {
  return {
    top: mergedRange.start.row,
    left: mergedRange.start.column,
    bottom: mergedRange.end.row,
    right: mergedRange.end.column
  }
};

const normalizeMergedRange = (mergedRange) => {
  return {
    start: {
      row: Math.min(mergedRange.start.row, mergedRange.end.row),
      column: Math.min(mergedRange.start.column, mergedRange.end.column)
    },
    end: {
      row: Math.max(mergedRange.start.row, mergedRange.end.row),
      column: Math.max(mergedRange.start.column, mergedRange.end.column)
    }
  }
};

const intersectRect = (a, b) => {
  return (a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom)
}

const rangesIntersect = (rangeA, rangeB) => {
  const normalizedA = normalizeMergedRange(rangeA);
  const normalizedB = normalizeMergedRange(rangeB);
  return intersectRect(convertRangeToRect(normalizedA), convertRangeToRect(normalizedB));
};

export const expandSelection = ({ selection, mergedCells = [], rowIndex, columnIndex }) => {
  const nextSelection = {
    start: {
      row: selection.start.row,
      column: selection.start.column
    },
    end: {
      row: rowIndex,
      column: columnIndex
    }
  };

  mergedCells.forEach(mergedRange => {
    if (rangesIntersect(mergedRange, nextSelection)) {
      if (nextSelection.start.row < nextSelection.end.row) {
        nextSelection.start.row = Math.min(nextSelection.start.row, mergedRange.start.row);
        nextSelection.end.row = Math.max(nextSelection.end.row, mergedRange.end.row);
      } else {
        nextSelection.start.row = Math.max(nextSelection.start.row, mergedRange.end.row);
        nextSelection.end.row = Math.min(nextSelection.end.row, mergedRange.start.row);
      }
      if (nextSelection.start.column < nextSelection.end.column) {
        nextSelection.start.column = Math.min(nextSelection.start.column, mergedRange.start.column);
        nextSelection.end.column = Math.max(nextSelection.end.column, mergedRange.end.column);
      } else {
        nextSelection.start.column = Math.max(nextSelection.start.column, mergedRange.end.column);
        nextSelection.end.column = Math.min(nextSelection.end.column, mergedRange.start.column);
      }
    }
  });

  return nextSelection;
};