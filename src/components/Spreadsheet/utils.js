export const getFixedCellOffset = ({ meta, defaultSize, index }) => {
  return [...new Array(index).keys()].reduce((acc, curKey, curIndex) => {
    const curMeta = meta[curIndex];
    const curResult = curMeta ? (curMeta.size || defaultSize) : defaultSize;
    return acc + curResult;
  }, 0);
};