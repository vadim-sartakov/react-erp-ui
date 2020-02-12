import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import { getCellsRangeSize } from '../utils/gridUtils';
/**
  * Calculates groups object of meta value
  * @param {import('./').Meta[]} meta
  * @returns {import('./').Group[][]}
  */

export var getGroups = function getGroups(meta) {
  var groups = [];

  _toConsumableArray(new Array(meta.length).keys()).forEach(function (key, index) {
    var metaItem = meta[index];
    var prevLevel = index > 0 ? meta[index - 1] && meta[index - 1].level || 0 : 0;
    var curLevel = metaItem && metaItem.level || 0; // Initializing groups of current level if there is no any

    var curLevelGroups;

    if (curLevel > 0) {
      if (!groups[curLevel - 1]) groups[curLevel - 1] = [];
      curLevelGroups = groups[curLevel - 1];
    }

    var closeGroups = function closeGroups(fromLevel, toLevel, toIndex) {
      for (var i = fromLevel; i > toLevel; i--) {
        var _curLevelGroups = groups[i - 1];
        var lastGroup = _curLevelGroups[_curLevelGroups.length - 1];
        var prevMeta = meta[lastGroup.start - 1];

        if (prevMeta && prevMeta.hidden) {
          _curLevelGroups.pop();

          continue;
        }

        if (!lastGroup.end) lastGroup.end = toIndex;

        var offsetReducer = function offsetReducer(acc, metaItem) {
          return metaItem && metaItem.hidden ? acc + 1 : acc;
        };

        var startOffset = meta.slice(0, lastGroup.start).reduce(offsetReducer, 0);
        var endOffset = meta.slice(lastGroup.start, toIndex + 1).reduce(offsetReducer, 0);
        var collapsed = endOffset && endOffset === lastGroup.end - lastGroup.start + 1;
        lastGroup.offsetStart = lastGroup.start - startOffset;
        lastGroup.offsetEnd = collapsed ? lastGroup.offsetStart : lastGroup.end - startOffset - endOffset;
        if (collapsed) lastGroup.collapsed = true;
      }
    };

    var levelDiff = curLevel - prevLevel; // Level increased

    if (levelDiff > 0) {
      curLevelGroups.push({
        start: index,
        level: curLevel
      }); // Level decreased
    } else if (levelDiff < 0) {
      // Closing all currently opened groups
      closeGroups(prevLevel, curLevel, index - 1);
    }

    if (index === meta.length - 1) closeGroups(curLevel, 0, index);
  });

  return groups;
};

var convertRangeToRect = function convertRangeToRect(mergedRange) {
  return {
    top: mergedRange.start.row,
    left: mergedRange.start.column,
    bottom: mergedRange.end.row,
    right: mergedRange.end.column
  };
};

var normalizeMergedRange = function normalizeMergedRange(mergedRange) {
  return {
    start: {
      row: Math.min(mergedRange.start.row, mergedRange.end.row),
      column: Math.min(mergedRange.start.column, mergedRange.end.column)
    },
    end: {
      row: Math.max(mergedRange.start.row, mergedRange.end.row),
      column: Math.max(mergedRange.start.column, mergedRange.end.column)
    }
  };
};

var intersectRect = function intersectRect(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};

var rangesIntersect = function rangesIntersect(rangeA, rangeB) {
  var normalizedA = normalizeMergedRange(rangeA);
  var normalizedB = normalizeMergedRange(rangeB);
  return intersectRect(convertRangeToRect(normalizedA), convertRangeToRect(normalizedB));
};

export var getIndexFromCoordinate = function getIndexFromCoordinate(_ref) {
  var coordinate = _ref.coordinate,
      meta = _ref.meta,
      defaultSize = _ref.defaultSize,
      totalCount = _ref.totalCount;
  var index;
  var curCoordinate = 0;

  for (var i = 0; i < totalCount; i++) {
    var curMeta = meta[i] || {};
    var size = curMeta.size || defaultSize;
    curCoordinate += size;

    if (coordinate <= curCoordinate) {
      index = i;
      break;
    }
  }

  return index;
};
export var expandSelection = function expandSelection(_ref2) {
  var selection = _ref2.selection,
      _ref2$mergedCells = _ref2.mergedCells,
      mergedCells = _ref2$mergedCells === void 0 ? [] : _ref2$mergedCells,
      rowIndex = _ref2.rowIndex,
      columnIndex = _ref2.columnIndex,
      east = _ref2.east,
      south = _ref2.south;
  var nextSelection = {
    start: {
      row: selection.start.row,
      column: selection.start.column
    },
    end: {
      row: rowIndex,
      column: columnIndex
    }
  };
  mergedCells.forEach(function (mergedRange) {
    if (rangesIntersect(mergedRange, nextSelection)) {
      if (nextSelection.start.row < nextSelection.end.row || east) {
        nextSelection.start.row = Math.min(nextSelection.start.row, mergedRange.start.row);
        nextSelection.end.row = Math.max(nextSelection.end.row, mergedRange.end.row);
      } else {
        nextSelection.start.row = Math.max(nextSelection.start.row, mergedRange.end.row);
        nextSelection.end.row = Math.min(nextSelection.end.row, mergedRange.start.row);
      }

      if (nextSelection.start.column < nextSelection.end.column || south) {
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
export var getOverscrolledOffset = function getOverscrolledOffset(_ref3) {
  var coordinate = _ref3.coordinate,
      containerSize = _ref3.containerSize,
      meta = _ref3.meta,
      fixCount = _ref3.fixCount,
      defaultSize = _ref3.defaultSize;
  var fixedSize = getCellsRangeSize({
    startIndex: 0,
    meta: meta,
    count: fixCount,
    defaultSize: defaultSize
  });
  var startOverscroll = coordinate - fixedSize;
  var endOverscroll = coordinate - containerSize;
  if (startOverscroll < 0) return startOverscroll;else if (endOverscroll > 0) return endOverscroll;
};