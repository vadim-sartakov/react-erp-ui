import React, { useContext, useMemo } from 'react';
import { SpreadsheetContext } from '../';
import GroupLineView from './GroupLineView';

const GroupLine = ({
  type,
  rowsGroups,
  columnsGroups,
  onRowGroupButtonClick,
  onColumnGroupButtonClick,
  Component = GroupLineView,
  ...props
}) => {
  const {
    rows,
    columns,
    rowIndex,
    columnIndex
  } = props;

  const { defaultRowHeight, defaultColumnWidth, groupSize } = useContext(SpreadsheetContext);

  const { group, lineStyle, containerStyle, onButtonClick } = useMemo(() => {
    let group, lineStyle, containerStyle, onButtonClick;
    if (type === 'row') {
      const currentRowLevelGroups = rowsGroups[columnIndex];
      group = currentRowLevelGroups && currentRowLevelGroups.find(group => (group.offsetStart - 1) === rowIndex);
      onButtonClick = onRowGroupButtonClick(group);

      const height = (rows[rowIndex] && rows[rowIndex].size) || defaultRowHeight;
      containerStyle = { height };
      lineStyle = {
        height: `calc(100% - ${height / 2}px)`,
        width: groupSize / 2,
        top: height / 2
      };
    } else {
      const currentColumnLevelGroups = columnsGroups[rowIndex];
      group = currentColumnLevelGroups && currentColumnLevelGroups.find(group => (group.offsetStart - 1) === columnIndex);
      onButtonClick = onColumnGroupButtonClick(group);

      const width = (columns[columnIndex] && columns[columnIndex].size) || defaultColumnWidth;
      containerStyle = { width };
      lineStyle = {
        width: `calc(100% - ${width / 2}px)`,
        left: width / 2,
        height: groupSize / 2
      }
    }
    return { group, lineStyle, containerStyle, onButtonClick };
  }, [
    columnIndex,
    columns,
    rows,
    type,
    defaultColumnWidth,
    defaultRowHeight,
    groupSize,
    rowIndex,
    rowsGroups,
    columnsGroups,
    onRowGroupButtonClick,
    onColumnGroupButtonClick
  ]);

  return (
    <Component
        {...props}
        type={type}
        containerStyle={containerStyle}
        lineStyle={lineStyle}
        collapsed={group.collapsed}
        onButtonClick={onButtonClick} />
  )
};

export default GroupLine;