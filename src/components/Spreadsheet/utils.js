export const getFixedCellOffset = ({ meta, defaultSize, index }) => {
  const sourceMeta = meta[index];
  const lastGroupItems = [];
  let resultOffset = [...new Array(index).keys()].reduce((acc, curKey, curIndex) => {
    const curMeta = meta[curIndex];
    let curResult = 0;
    if (curMeta) {
      if (curMeta.fixed) {
        curResult = curMeta.size || defaultSize;
      }
      if (curMeta.isGroup) {
        lastGroupItems[curMeta.level || 0] = curMeta;
      }
    }
    return acc + curResult;
  }, 0);

  if (sourceMeta.isGroup) {
    resultOffset = lastGroupItems
        .slice(0, sourceMeta.level)
        .reduce((acc, lastGroupMetaItem) => acc + (lastGroupMetaItem.size || defaultSize), resultOffset);
  }
  return resultOffset;
};