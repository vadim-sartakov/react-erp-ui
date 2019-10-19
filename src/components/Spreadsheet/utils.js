export const getFixedCellOffset = ({ meta, defaultSize, index }) => {
  const sourceMeta = meta[index];
  const lastGroupItems = [];
  return [...new Array(index).keys()].reduce((acc, curKey, curIndex) => {
    const curMeta = meta[curIndex];
    let curResult = 0;
    if (curMeta) {
      if (curMeta.level) lastGroupItems[curMeta.level - 1] = curMeta;
      if (curMeta.fixed) {
        curResult = curMeta.size || defaultSize;
      }
      else if (curMeta.isGroup) {
        curResult = lastGroupItems
            .slice(0, sourceMeta.level - 1)
            .reduce((acc, lastGroupMetaItem) => acc + lastGroupMetaItem.size, curResult);
      }
    }
    return acc + curResult;
  }, 0);
};