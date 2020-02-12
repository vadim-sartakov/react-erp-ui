import _objectWithoutProperties from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/objectWithoutProperties";
import React, { useContext, useMemo } from 'react';
import { SpreadsheetContext } from '../';
import GroupLineView from './GroupLineView';

var GroupLine = function GroupLine(_ref) {
  var type = _ref.type,
      rowsGroups = _ref.rowsGroups,
      columnsGroups = _ref.columnsGroups,
      onRowGroupButtonClick = _ref.onRowGroupButtonClick,
      onColumnGroupButtonClick = _ref.onColumnGroupButtonClick,
      _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? GroupLineView : _ref$Component,
      props = _objectWithoutProperties(_ref, ["type", "rowsGroups", "columnsGroups", "onRowGroupButtonClick", "onColumnGroupButtonClick", "Component"]);

  var rows = props.rows,
      columns = props.columns,
      rowIndex = props.rowIndex,
      columnIndex = props.columnIndex;

  var _useContext = useContext(SpreadsheetContext),
      defaultRowHeight = _useContext.defaultRowHeight,
      defaultColumnWidth = _useContext.defaultColumnWidth,
      groupSize = _useContext.groupSize;

  var _useMemo = useMemo(function () {
    var group, lineStyle, containerStyle, onButtonClick;

    if (type === 'row') {
      var currentRowLevelGroups = rowsGroups[columnIndex];
      group = currentRowLevelGroups && currentRowLevelGroups.find(function (group) {
        return group.offsetStart - 1 === rowIndex;
      });
      onButtonClick = onRowGroupButtonClick(group);
      var height = rows[rowIndex] && rows[rowIndex].size || defaultRowHeight;
      containerStyle = {
        height: height
      };
      lineStyle = {
        height: "calc(100% - ".concat(height / 2, "px)"),
        width: groupSize / 2,
        top: height / 2
      };
    } else {
      var currentColumnLevelGroups = columnsGroups[rowIndex];
      group = currentColumnLevelGroups && currentColumnLevelGroups.find(function (group) {
        return group.offsetStart - 1 === columnIndex;
      });
      onButtonClick = onColumnGroupButtonClick(group);
      var width = columns[columnIndex] && columns[columnIndex].size || defaultColumnWidth;
      containerStyle = {
        width: width
      };
      lineStyle = {
        width: "calc(100% - ".concat(width / 2, "px)"),
        left: width / 2,
        height: groupSize / 2
      };
    }

    return {
      group: group,
      lineStyle: lineStyle,
      containerStyle: containerStyle,
      onButtonClick: onButtonClick
    };
  }, [columnIndex, columns, rows, type, defaultColumnWidth, defaultRowHeight, groupSize, rowIndex, rowsGroups, columnsGroups, onRowGroupButtonClick, onColumnGroupButtonClick]),
      group = _useMemo.group,
      lineStyle = _useMemo.lineStyle,
      containerStyle = _useMemo.containerStyle,
      onButtonClick = _useMemo.onButtonClick;

  return React.createElement(Component, Object.assign({}, props, {
    type: type,
    containerStyle: containerStyle,
    lineStyle: lineStyle,
    collapsed: group.collapsed,
    onButtonClick: onButtonClick
  }));
};

export default GroupLine;