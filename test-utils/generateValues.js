import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
export var generateMeta = function generateMeta(count) {
  return _toConsumableArray(new Array(count).keys());
};
export var generateListValues = function generateListValues(count) {
  return generateMeta(count).map(function (row) {
    return "Value ".concat(row);
  });
};
export var generateGridValues = function generateGridValues(rowsCount, columnsCount) {
  return generateMeta(rowsCount).map(function (row) {
    return generateMeta(columnsCount).map(function (column) {
      return "Value ".concat(row, " - ").concat(column);
    });
  });
};