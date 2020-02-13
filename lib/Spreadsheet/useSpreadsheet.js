import _slicedToArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/slicedToArray";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { useRef, useState, useMemo, useCallback } from 'react';
import { getGroups } from './utils';
export var convertExternalMetaToInternal = function convertExternalMetaToInternal(_ref) {
  var _ref$meta = _ref.meta,
      meta = _ref$meta === void 0 ? [] : _ref$meta,
      groups = _ref.groups,
      groupSize = _ref.groupSize,
      numberMetaSize = _ref.numberMetaSize,
      hideHeadings = _ref.hideHeadings;
  var result = [];
  groups.length && !hideHeadings && _toConsumableArray(new Array(groups.length + 1).keys()).forEach(function (group) {
    return result.push({
      size: groupSize,
      type: 'GROUP'
    });
  });
  if (!hideHeadings) result.push({
    size: numberMetaSize,
    type: 'NUMBER'
  }); // Not using filter here because meta may contain empty items
  // And it's not processing by filter function

  var filteredMeta = _toConsumableArray(meta);

  for (var index = 0; index < filteredMeta.length; index++) {
    var metaItem = filteredMeta[index];

    if (metaItem && metaItem.hidden) {
      filteredMeta.splice(index, 1);
      index -= 1;
    }
  }

  result.push.apply(result, _toConsumableArray(filteredMeta));
  return result;
};
export var convertInternalMetaToExternal = function convertInternalMetaToExternal(_ref2) {
  var meta = _ref2.meta,
      originExternalMeta = _ref2.originExternalMeta,
      hiddenIndexes = _ref2.hiddenIndexes;

  var result = _toConsumableArray(meta).filter(function (metaItem) {
    return metaItem ? !metaItem.type : true;
  });

  hiddenIndexes.forEach(function (index) {
    return result.splice(index, 0, originExternalMeta[index]);
  });
  return result;
};

var clickGroupLevelButton = function clickGroupLevelButton(meta, level) {
  return meta.map(function (metaItem) {
    if (!metaItem || !metaItem.level) return metaItem;else if (metaItem.level >= level) return _objectSpread({}, metaItem, {
      hidden: true
    });else {
      var nextItem = _objectSpread({}, metaItem);

      delete nextItem.hidden;
      return nextItem;
    }
  });
};

var clickGroupButton = function clickGroupButton(meta, group, specialMetaCount) {
  var nextMeta = _toConsumableArray(meta);

  for (var index = group.start - specialMetaCount; index <= group.end - specialMetaCount; index++) {
    var metaItem = meta[index] || {};
    if (group.collapsed && metaItem.level > group.level) continue;
    nextMeta[index] = _objectSpread({}, metaItem, {
      hidden: !group.collapsed
    });
  }

  return nextMeta;
};
/**
 * @param {import('.').UseSpreadsheetOptions} options
 * @returns {import('.').UseSpreadsheetResult}
 */


var useSpreadsheet = function useSpreadsheet(_ref3) {
  var defaultCells = _ref3.defaultCells,
      cellsProp = _ref3.cells,
      onCellsChangeProp = _ref3.onCellsChange,
      defaultRows = _ref3.defaultRows,
      rowsProp = _ref3.rows,
      onRowsChangeProp = _ref3.onRowsChange,
      defaultColumns = _ref3.defaultColumns,
      columnsProp = _ref3.columns,
      onColumnsChangeProp = _ref3.onColumnsChange,
      selectedCellsProp = _ref3.selectedCells,
      onSelectedCellsChangeProp = _ref3.onSelectedCellsChange,
      columnHeadingHeight = _ref3.columnHeadingHeight,
      rowHeadingWidth = _ref3.rowHeadingWidth,
      totalRows = _ref3.totalRows,
      totalColumns = _ref3.totalColumns,
      _ref3$fixRows = _ref3.fixRows,
      fixRows = _ref3$fixRows === void 0 ? 0 : _ref3$fixRows,
      _ref3$fixColumns = _ref3.fixColumns,
      fixColumns = _ref3$fixColumns === void 0 ? 0 : _ref3$fixColumns,
      hideHeadings = _ref3.hideHeadings,
      groupSize = _ref3.groupSize,
      mergedCellsProp = _ref3.mergedCells;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      selectedCellsState = _useState2[0],
      setSelectedCellsState = _useState2[1];

  var selectedCells = selectedCellsProp || selectedCellsState;
  var onSelectedCellsChange = onSelectedCellsChangeProp || setSelectedCellsState;

  var _useState3 = useState(defaultRows || []),
      _useState4 = _slicedToArray(_useState3, 2),
      rowsState = _useState4[0],
      setRowsState = _useState4[1];

  var _useState5 = useState(defaultColumns || []),
      _useState6 = _slicedToArray(_useState5, 2),
      columnsState = _useState6[0],
      setColumnsState = _useState6[1];

  var rows = rowsProp || rowsState;
  var columns = columnsProp || columnsState;
  var onRowsChange = onRowsChangeProp || setRowsState;
  var onColumnsChange = onColumnsChangeProp || setColumnsState;
  var metaReducer = useCallback(function (acc, metaItem, index) {
    return metaItem && metaItem.hidden ? [].concat(_toConsumableArray(acc), [index]) : acc;
  }, []);
  var hiddenRowsIndexes = useMemo(function () {
    return rows.reduce(metaReducer, []);
  }, [rows, metaReducer]);
  var hiddenColumnsIndexes = useMemo(function () {
    return columns.reduce(metaReducer, []);
  }, [columns, metaReducer]);
  var convertExternalRowsToInternal = useCallback(function (rows) {
    var groups = getGroups(columns);
    return convertExternalMetaToInternal({
      meta: rows,
      numberMetaSize: columnHeadingHeight,
      groups: groups,
      groupSize: groupSize,
      hideHeadings: hideHeadings
    });
  }, [columnHeadingHeight, columns, groupSize, hideHeadings]);
  var convertExternalColumnsToInternal = useCallback(function (columns) {
    var groups = getGroups(rows);
    return convertExternalMetaToInternal({
      meta: columns,
      numberMetaSize: rowHeadingWidth,
      groups: groups,
      groupSize: groupSize,
      hideHeadings: hideHeadings
    });
  }, [rowHeadingWidth, rows, groupSize, hideHeadings]);
  var nextRows = useMemo(function () {
    var result = _toConsumableArray(new Array(totalRows).keys()).map(function (key) {
      var curRow = rows[key];
      return _objectSpread({}, curRow, {
        key: key
      });
    });

    return convertExternalRowsToInternal(result);
  }, [rows, totalRows, convertExternalRowsToInternal]);
  var nextOnRowsChange = useCallback(function (setRows) {
    onRowsChange(function (rows) {
      var nextRows;
      if (typeof setRows === 'function') nextRows = setRows(convertExternalRowsToInternal(rows));else nextRows = setRows;
      nextRows = convertInternalMetaToExternal({
        meta: nextRows,
        originExternalMeta: rows,
        hiddenIndexes: hiddenRowsIndexes
      });
      return nextRows;
    });
  }, [onRowsChange, convertExternalRowsToInternal, hiddenRowsIndexes]);
  var specialRowsCount = useMemo(function () {
    return nextRows.filter(function (row) {
      return row && row.type;
    }).length;
  }, [nextRows]);
  var onRowGroupLevelButtonClick = useCallback(function (level) {
    return function (event) {
      return onRowsChange(clickGroupLevelButton(rows, level));
    };
  }, [rows, onRowsChange]);
  var onRowGroupButtonClick = useCallback(function (group) {
    return function (event) {
      return onRowsChange(clickGroupButton(rows, group, specialRowsCount));
    };
  }, [rows, onRowsChange, specialRowsCount]);
  var nextColumns = useMemo(function () {
    var result = _toConsumableArray(new Array(totalColumns).keys()).map(function (key) {
      var curColumn = columns[key];
      return _objectSpread({}, curColumn, {
        key: key
      });
    });

    return convertExternalColumnsToInternal(result);
  }, [columns, convertExternalColumnsToInternal, totalColumns]);
  var specialColumnsCount = useMemo(function () {
    return nextColumns.filter(function (column) {
      return column && column.type;
    }).length;
  }, [nextColumns]);
  var nextOnColumnsChange = useCallback(function (setColumns) {
    onColumnsChange(function (columns) {
      var nextColumns;
      if (typeof setColumns === 'function') nextColumns = setColumns(convertExternalColumnsToInternal(columns));else nextColumns = setColumns;
      nextColumns = convertInternalMetaToExternal({
        meta: nextColumns,
        originExternalMeta: columns,
        hiddenIndexes: hiddenColumnsIndexes
      });
      return nextColumns;
    });
  }, [convertExternalColumnsToInternal, hiddenColumnsIndexes, onColumnsChange]);
  var onColumnGroupLevelButtonClick = useCallback(function (level) {
    return function (event) {
      return onColumnsChange(clickGroupLevelButton(columns, level));
    };
  }, [columns, onColumnsChange]);
  var onColumnGroupButtonClick = useCallback(function (group) {
    return function (event) {
      return onColumnsChange(clickGroupButton(columns, group, specialColumnsCount));
    };
  }, [columns, onColumnsChange, specialColumnsCount]);

  var _useState7 = useState(defaultCells || []),
      _useState8 = _slicedToArray(_useState7, 2),
      cellsState = _useState8[0],
      setCellsState = _useState8[1];

  var cells = cellsProp || cellsState;
  var onCellsChange = onCellsChangeProp || setCellsState; // Using mapper here because we calculated groups based on external (not filtered meta)
  // We can't calculate groups of internal meta because it does not have hidden items
  // Thus, we need to apply special meta offset

  var groupMapper = useCallback(function (specialMetaCount) {
    return function (group) {
      return _objectSpread({}, group, {
        start: group.start + specialMetaCount,
        end: group.end + specialMetaCount,
        offsetStart: group.offsetStart + specialMetaCount,
        offsetEnd: group.offsetEnd + specialMetaCount
      });
    };
  }, []);
  var rowsGroups = useMemo(function () {
    return getGroups(rows).map(function (curLevelGroups) {
      return curLevelGroups.map(groupMapper(specialRowsCount));
    });
  }, [rows, groupMapper, specialRowsCount]);
  var columnsGroups = useMemo(function () {
    return getGroups(columns).map(function (curLevelGroups) {
      return curLevelGroups.map(groupMapper(specialColumnsCount));
    });
  }, [columns, groupMapper, specialColumnsCount]);
  var mergedCells = useMemo(function () {
    var mergedCellsWithOffset = (mergedCellsProp || []).map(function (mergedRange) {
      return {
        start: {
          row: mergedRange.start.row + specialRowsCount,
          column: mergedRange.start.column + specialColumnsCount
        },
        end: {
          row: mergedRange.end.row + specialRowsCount,
          column: mergedRange.end.column + specialColumnsCount
        }
      };
    }); // Adding groups merges

    var mergedRowGroups = hideHeadings ? [] : rowsGroups.reduce(function (acc, rowLevelGroups, level) {
      var rowGroups = rowLevelGroups.reduce(function (acc, rowGroup) {
        return [].concat(_toConsumableArray(acc), [{
          start: {
            row: rowGroup.offsetStart - 1,
            column: level
          },
          end: {
            row: rowGroup.collapsed ? rowGroup.offsetStart - 1 : rowGroup.offsetEnd,
            column: level
          }
        }]);
      }, []);
      return [].concat(_toConsumableArray(acc), _toConsumableArray(rowGroups));
    }, []);
    var mergedColumnsGroups = hideHeadings ? [] : columnsGroups.reduce(function (acc, columnLevelGroups, level) {
      var columnGroups = columnLevelGroups.reduce(function (acc, columnGroup) {
        return [].concat(_toConsumableArray(acc), [{
          start: {
            row: level,
            column: columnGroup.offsetStart - 1
          },
          end: {
            row: level,
            column: columnGroup.collapsed ? columnGroup.offsetStart - 1 : columnGroup.offsetEnd
          }
        }]);
      }, []);
      return [].concat(_toConsumableArray(acc), _toConsumableArray(columnGroups));
    }, []);
    return [].concat(_toConsumableArray(mergedCellsWithOffset), _toConsumableArray(mergedRowGroups), _toConsumableArray(mergedColumnsGroups));
  }, [mergedCellsProp, specialRowsCount, specialColumnsCount, rowsGroups, columnsGroups, hideHeadings]);
  var nextTotalRows = totalRows + specialRowsCount - hiddenRowsIndexes.length;
  var nextTotalColumns = totalColumns + specialColumnsCount - hiddenColumnsIndexes.length;
  var nextFixRows = fixRows + specialRowsCount;
  var nextFixColumns = fixColumns + specialColumnsCount;
  var scrollerContainerRef = useRef();
  var scrollerCoverRef = useRef();
  var spreadsheetContainerRef = useRef();

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      resizeInteraction = _useState10[0],
      onResizeInteractionChange = _useState10[1];

  var _useState11 = useState(_toConsumableArray(nextRows)),
      _useState12 = _slicedToArray(_useState11, 2),
      resizeRows = _useState12[0],
      onResizeRows = _useState12[1];

  var _useState13 = useState(_toConsumableArray(nextColumns)),
      _useState14 = _slicedToArray(_useState13, 2),
      resizeColumns = _useState14[0],
      onResizeColumns = _useState14[1];

  return {
    cells: cells,
    onCellsChange: onCellsChange,
    rows: nextRows,
    columns: nextColumns,
    onColumnsChange: nextOnColumnsChange,
    onRowsChange: nextOnRowsChange,
    selectedCells: selectedCells,
    onSelectedCellsChange: onSelectedCellsChange,
    totalRows: nextTotalRows,
    totalColumns: nextTotalColumns,
    fixRows: nextFixRows,
    fixColumns: nextFixColumns,
    mergedCells: mergedCells,
    specialRowsCount: specialRowsCount,
    specialColumnsCount: specialColumnsCount,
    rowsGroups: rowsGroups,
    columnsGroups: columnsGroups,
    onRowGroupLevelButtonClick: onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick: onColumnGroupLevelButtonClick,
    onRowGroupButtonClick: onRowGroupButtonClick,
    onColumnGroupButtonClick: onColumnGroupButtonClick,
    scrollerContainerRef: scrollerContainerRef,
    scrollerCoverRef: scrollerCoverRef,
    spreadsheetContainerRef: spreadsheetContainerRef,
    resizeInteraction: resizeInteraction,
    onResizeInteractionChange: onResizeInteractionChange,
    resizeRows: resizeRows,
    resizeColumns: resizeColumns,
    onResizeRows: onResizeRows,
    onResizeColumns: onResizeColumns
  };
};

export default useSpreadsheet;