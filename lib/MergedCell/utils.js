import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";

/**
 * Calculates cell position (top and left absolute position)
 * @param {Object} options
 * @param {import('./').Meta} options.meta
 * @param {number} options.index
 * @param {number} options.defaultSize
 */
export var getCellPosition = function getCellPosition(_ref) {
  var _ref$meta = _ref.meta,
      meta = _ref$meta === void 0 ? [] : _ref$meta,
      index = _ref.index,
      defaultSize = _ref.defaultSize;
  return _toConsumableArray(new Array(index).keys()).reduce(function (acc, key, index) {
    var curMeta = meta[index];
    var curSize = curMeta && curMeta.size || defaultSize;
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

export var getCellsRangeSize = function getCellsRangeSize(_ref2) {
  var count = _ref2.count,
      _ref2$meta = _ref2.meta,
      meta = _ref2$meta === void 0 ? [] : _ref2$meta,
      _ref2$startIndex = _ref2.startIndex,
      startIndex = _ref2$startIndex === void 0 ? 0 : _ref2$startIndex,
      defaultSize = _ref2.defaultSize;
  return count && _toConsumableArray(new Array(count).keys()).reduce(function (acc, key, index) {
    var mergedMeta = meta[startIndex + index];
    var size = mergedMeta && mergedMeta.size || defaultSize;
    return acc + size;
  }, 0);
};