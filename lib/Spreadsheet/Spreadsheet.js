import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { useMemo } from 'react';
import { useScroller, ScrollerContainer } from '../Scroller';
import { SpreadsheetContext, SpreadsheetCell, useSpreadsheet, useKeyboard, useMouse } from './';
import GroupLevelButton from './GroupLevelButton';
import { Heading, HeadingsIntersection } from './Heading';
import { GroupLine } from './GroupLine';
import ResizeLines from './ResizeLines';
import FixLines from './FixLines';
import SpecialCellEmptyArea from './SpecialCellEmptyArea';
import SelectedRange from './SelectedRange';
import Cell from './Cell';
export var visibleRangesFilter = function visibleRangesFilter(_ref) {
  var fixRows = _ref.fixRows,
      fixColumns = _ref.fixColumns,
      visibleRows = _ref.visibleRows,
      visibleColumns = _ref.visibleColumns;
  return function (mergedRange) {
    return mergedRange.start.row < visibleRows[fixRows] || mergedRange.start.column < visibleColumns[fixColumns] || mergedRange.start.row <= visibleRows[visibleRows.length - 1] && mergedRange.start.column <= visibleColumns[visibleColumns.length - 1] && mergedRange.end.row >= visibleRows[fixRows] && mergedRange.end.column >= visibleColumns[fixColumns];
  };
};
var Cells = React.memo(function (_ref2) {
  var HeadingComponent = _ref2.HeadingComponent,
      _ref2$HeadingsInterse = _ref2.HeadingsIntersectionComponent,
      HeadingsIntersectionComponent = _ref2$HeadingsInterse === void 0 ? HeadingsIntersection : _ref2$HeadingsInterse,
      _ref2$GroupLevelButto = _ref2.GroupLevelButtonComponent,
      GroupLevelButtonComponent = _ref2$GroupLevelButto === void 0 ? GroupLevelButton : _ref2$GroupLevelButto,
      _ref2$SpecialCellEmpt = _ref2.SpecialCellEmptyAreaComponent,
      SpecialCellEmptyAreaComponent = _ref2$SpecialCellEmpt === void 0 ? SpecialCellEmptyArea : _ref2$SpecialCellEmpt,
      CellComponent = _ref2.CellComponent,
      props = _objectWithoutProperties(_ref2, ["HeadingComponent", "HeadingsIntersectionComponent", "GroupLevelButtonComponent", "SpecialCellEmptyAreaComponent", "CellComponent"]);

  return props.visibleRows.reduce(function (acc, rowIndex, seqRowIndex) {
    var row = props.rows[rowIndex] || {};
    var rowType = row.type;
    var columnsElements = props.visibleColumns.map(function (columnIndex, seqColumnIndex) {
      var column = props.columns[columnIndex] || {};
      var columnsType = column.type;
      var key = "".concat(seqRowIndex, "_").concat(seqColumnIndex);
      var isMerged = !rowType && !columnsType ? props.mergedCells.some(function (mergedRange) {
        return rowIndex >= mergedRange.start.row && columnIndex >= mergedRange.start.column && rowIndex <= mergedRange.end.row && columnIndex <= mergedRange.end.column;
      }) : false;

      if (isMerged) {
        return React.createElement(SpreadsheetCell, {
          key: key,
          row: row,
          column: column
        });
      } else {
        switch (rowType) {
          case 'GROUP':
            switch (columnsType) {
              case 'NUMBER':
                return React.createElement(GroupLevelButtonComponent, {
                  key: key,
                  index: rowIndex,
                  row: row,
                  column: column,
                  onClick: props.onColumnGroupLevelButtonClick(rowIndex + 1)
                });

              default:
                return React.createElement(SpecialCellEmptyAreaComponent, {
                  key: key,
                  row: row,
                  column: column
                });
            }

          case 'NUMBER':
            switch (columnsType) {
              case 'GROUP':
                return React.createElement(GroupLevelButtonComponent, {
                  key: key,
                  row: row,
                  column: column,
                  index: columnIndex,
                  onClick: props.onRowGroupLevelButtonClick(columnIndex + 1),
                  style: {
                    zIndex: 8
                  }
                });

              case 'NUMBER':
                return React.createElement(HeadingsIntersectionComponent, {
                  key: key,
                  row: row,
                  column: column
                });

              default:
                return React.createElement(Heading, {
                  key: key,
                  Component: HeadingComponent,
                  selectedCells: props.selectedCells,
                  row: row,
                  column: column,
                  type: "column",
                  meta: column,
                  onResizeInteractionChange: props.onResizeInteractionChange,
                  defaultSize: props.defaultColumnWidth,
                  index: columnIndex,
                  onChange: props.onColumnsChange,
                  onResize: props.onResizeColumns
                });
            }

          default:
            var rowCells = props.cells[rowIndex - props.specialRowsCount];
            var curCell = rowCells && rowCells[columnIndex - props.specialColumnsCount];

            switch (columnsType) {
              case 'GROUP':
                return React.createElement(SpecialCellEmptyArea, {
                  key: key,
                  row: row,
                  column: column
                });

              case 'NUMBER':
                return React.createElement(Heading, {
                  key: key,
                  Component: HeadingComponent,
                  selectedCells: props.selectedCells,
                  row: row,
                  column: column,
                  type: "row",
                  meta: row,
                  index: rowIndex,
                  onResizeInteractionChange: props.onResizeInteractionChange,
                  defaultSize: props.defaultRowHeight,
                  onChange: props.onRowsChange,
                  onResize: props.onResizeRows
                });

              default:
                return React.createElement(Cell, {
                  key: key,
                  mergedCells: props.mergedCells,
                  fixRows: props.fixRows,
                  fixColumns: props.fixColumns,
                  row: row,
                  column: column,
                  rowIndex: rowIndex,
                  columnIndex: columnIndex,
                  cell: curCell,
                  Component: CellComponent,
                  onSelectedCellsChange: props.onSelectedCellsChange
                });
            }

        }
      }
    });
    return [].concat(_toConsumableArray(acc), _toConsumableArray(columnsElements));
  }, []);
});
var MergedCells = React.memo(function (_ref3) {
  var GroupLineComponent = _ref3.GroupLineComponent,
      CellComponent = _ref3.CellComponent,
      props = _objectWithoutProperties(_ref3, ["GroupLineComponent", "CellComponent"]);

  var visibleMerges = props.mergedCells.filter(visibleRangesFilter({
    fixRows: props.fixRows,
    fixColumns: props.fixColumns,
    visibleRows: props.visibleRows,
    visibleColumns: props.visibleColumns
  }));
  return visibleMerges.map(function (mergedRange) {
    var columnIndex = mergedRange.start.column;
    var rowIndex = mergedRange.start.row;
    var row = props.rows[rowIndex] || {};
    var column = props.columns[columnIndex] || {};
    var rowCells = props.cells[rowIndex - props.specialRowsCount];
    var curCell = rowCells && rowCells[columnIndex - props.specialColumnsCount];
    var mergedCellProps = {
      key: "merged-cell-".concat(rowIndex, "-").concat(columnIndex),
      mergedRange: mergedRange,
      rows: props.rows,
      columns: props.columns,
      fixRows: props.fixRows,
      fixColumns: props.fixColumns,
      rowIndex: rowIndex,
      columnIndex: columnIndex,
      scrollerTop: props.scrollerTop,
      scrollerLeft: props.scrollerLeft,
      defaultRowHeight: props.defaultRowHeight,
      defaultColumnWidth: props.defaultColumnWidth
    };

    if (row.type === 'GROUP' || column.type === 'GROUP') {
      return React.createElement(GroupLine, Object.assign({}, mergedCellProps, {
        type: row.type === 'GROUP' ? 'column' : 'row',
        rows: props.rows,
        columns: props.columns,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        rowsGroups: props.rowsGroups,
        columnsGroups: props.columnsGroups,
        onRowGroupButtonClick: props.onRowGroupButtonClick,
        onColumnGroupButtonClick: props.onColumnGroupButtonClick,
        Component: GroupLineComponent
      }));
    } else {
      return React.createElement(Cell, Object.assign({}, mergedCellProps, {
        Component: CellComponent,
        mergedCells: props.mergedCells,
        row: row,
        column: column,
        cell: curCell,
        onSelectedCellsChange: props.onSelectedCellsChange
      }));
    }
  });
});
var SelectedRanges = React.memo(function (_ref4) {
  var _ref4$SelectedRangeCo = _ref4.SelectedRangeComponent,
      SelectedRangeComponent = _ref4$SelectedRangeCo === void 0 ? SelectedRange : _ref4$SelectedRangeCo,
      props = _objectWithoutProperties(_ref4, ["SelectedRangeComponent"]);

  var visibleSelections = props.selectedCells.filter(visibleRangesFilter);
  return visibleSelections.map(function (selectedRange, seqIndex) {
    var mergedRange = selectedRange;
    return React.createElement(SelectedRangeComponent, {
      key: "selected-cell-".concat(props.rowsPage, "-").concat(props.columnsPage, "-").concat(seqIndex),
      mergedRange: mergedRange,
      rows: props.rows,
      columns: props.columns,
      fixRows: props.fixRows,
      fixColumns: props.fixColumns,
      scrollerTop: props.scrollerTop,
      scrollerLeft: props.scrollerLeft,
      defaultRowHeight: props.defaultRowHeight,
      defaultColumnWidth: props.defaultColumnWidth,
      multiple: visibleSelections.length > 1
    });
  });
});
/** @type {import('react').FunctionComponent<import('./').SpreadsheetProps>} */

var Spreadsheet = function Spreadsheet(inputProps) {
  var props;
  var printProps = inputProps.printMode ? {
    width: 'auto',
    height: 'auto',
    rowsPerPage: inputProps.totalRows,
    columnsPerPage: inputProps.totalColumns,
    hideHeadings: true,
    hideGrid: true,
    fixRows: 0,
    fixColumns: 0
  } : undefined;
  props = _objectSpread({}, inputProps, {}, printProps);
  var spreadsheetProps = useSpreadsheet(props);
  props = _objectSpread({}, inputProps, {}, printProps, {}, spreadsheetProps);
  var onKeyDown = useKeyboard(props);
  var onMouseDown = useMouse(props);
  var scrollerProps = useScroller(props);
  props = _objectSpread({}, inputProps, {}, printProps, {}, spreadsheetProps, {}, scrollerProps);
  var cellsElement = React.createElement(Cells, {
    HeadingComponent: props.HeadingComponent,
    HeadingsIntersectionComponent: props.HeadingsIntersectionComponent,
    GroupLevelButtonComponent: props.GroupLevelButtonComponent,
    SpecialCellEmptyAreaComponent: props.SpecialCellEmptyAreaComponent,
    CellComponent: props.CellComponent,
    selectedCells: props.selectedCells,
    onSelectedCellsChange: props.onSelectedCellsChange,
    visibleRows: props.visibleRows,
    visibleColumns: props.visibleColumns,
    cells: props.cells,
    rows: props.rows,
    columns: props.columns,
    onRowsChange: props.onRowsChange,
    onColumnsChange: props.onColumnsChange,
    mergedCells: props.mergedCells,
    defaultRowHeight: props.defaultRowHeight,
    defaultColumnWidth: props.defaultColumnWidth,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns,
    specialRowsCount: props.specialRowsCount,
    specialColumnsCount: props.specialColumnsCount,
    onRowGroupLevelButtonClick: props.onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick: props.onColumnGroupLevelButtonClick,
    onResizeInteractionChange: props.onResizeInteractionChange,
    onResizeRows: props.onResizeRows,
    onResizeColumns: props.onResizeColumns
  });
  var mergedCellsElements = React.createElement(MergedCells, {
    mergedCells: props.mergedCells,
    GroupLineComponent: props.GroupLineComponent,
    CellComponent: props.CellComponent,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns,
    visibleRows: props.visibleRows,
    visibleColumns: props.visibleColumns,
    rows: props.rows,
    columns: props.columns,
    cells: props.cells,
    specialRowsCount: props.specialRowsCount,
    specialColumnsCount: props.specialColumnsCount,
    defaultRowHeight: props.defaultRowHeight,
    defaultColumnWidth: props.defaultColumnWidth,
    rowsGroups: props.rowsGroups,
    columnsGroups: props.columnsGroups,
    onRowGroupButtonClick: props.onRowGroupButtonClick,
    onColumnGroupButtonClick: props.onColumnGroupButtonClick,
    onSelectedCellsChange: props.onSelectedCellsChange
  });
  var visibleSelectionElements = React.createElement(SelectedRanges, {
    SelectedRangeComponent: props.SelectedRangeComponent,
    selectedCells: props.selectedCells,
    rowsPage: props.rowsPage,
    columnsPage: props.columnsPage,
    rows: props.rows,
    columns: props.columns,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns,
    defaultRowHeight: props.defaultRowHeight,
    defaultColumnWidth: props.defaultColumnWidth
  });
  var fixedAreasElement = React.createElement(FixLines, {
    Component: props.FixLinesComponent,
    rows: props.rows,
    columns: props.columns,
    specialRowsCount: props.specialRowsCount,
    specialColumnsCount: props.specialColumnsCount
  });
  var resizeRowElement = props.resizeInteraction && props.resizeInteraction.type === 'row' && React.createElement(ResizeLines, {
    index: props.resizeInteraction.index,
    visibleIndexes: props.visibleRows,
    fixCount: props.fixRows,
    type: "row",
    defaultSize: props.defaultRowHeight,
    meta: props.resizeRows
  });
  var resizeColumnElement = props.resizeInteraction && props.resizeInteraction.type === 'column' && React.createElement(ResizeLines, {
    index: props.resizeInteraction.index,
    visibleIndexes: props.visibleColumns,
    fixCount: props.fixColumns,
    type: "column",
    defaultSize: props.defaultColumnWidth,
    meta: props.resizeColumns
  });
  var contextValue = useMemo(function () {
    return {
      defaultColumnWidth: props.defaultColumnWidth,
      defaultRowHeight: props.defaultRowHeight,
      groupSize: props.groupSize,
      fixRows: props.fixRows,
      fixColumns: props.fixColumns,
      cellBorderColor: props.cellBorderColor || '#dee2e6',
      hideGrid: props.hideGrid
    };
  }, [props.defaultColumnWidth, props.defaultRowHeight, props.groupSize, props.fixRows, props.fixColumns, props.cellBorderColor, props.hideGrid]);
  return React.createElement(SpreadsheetContext.Provider, {
    value: contextValue
  }, React.createElement(ScrollerContainer, {
    ref: props.scrollerContainerRef,
    className: props.className,
    onKeyDown: onKeyDown,
    defaultRowHeight: props.defaultRowHeight,
    defaultColumnWidth: props.defaultColumnWidth,
    onScroll: props.onScroll,
    width: props.width,
    height: props.height //'hidden' value will prevent scroll appearing on print mode
    ,
    style: {
      overflow: props.printMode ? 'hidden' : 'auto'
    }
  }, React.createElement("div", {
    ref: props.scrollerCoverRef,
    style: props.coverStyles,
    onMouseDown: onMouseDown
  }, React.createElement("div", {
    style: _objectSpread({}, props.pagesStyles, {
      position: props.printMode ? 'static' : 'absolute'
    })
  }, React.createElement("div", {
    style: _objectSpread({}, props.gridStyles, {
      userSelect: 'none'
    })
  }, cellsElement)), mergedCellsElements, visibleSelectionElements, resizeRowElement, resizeColumnElement, fixedAreasElement)));
};

export default Spreadsheet;