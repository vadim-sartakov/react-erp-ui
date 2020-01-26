import React, { useContext, useMemo } from 'react';
import { SpreadsheetContext } from '../';

const GroupLine = ({
  type,
  rows,
  columns,
  rowsGroups,
  columnsGroups,
  rowIndex,
  columnIndex,
  collapsed,
  onRowGroupButtonClick,
  onColumnGroupButtonClick,
  Component
}) => {
  const { defaultRowHeight, defaultColumnWidth, groupSize } = useContext(SpreadsheetContext);

  const { lineStyle, containerStyle, onClick } = useMemo(() => {
    let lineStyle, containerStyle, onClick;
    if (type === 'row') {
      const currentRowLevelGroups = rowsGroups[columnIndex];
      const rowGroup = currentRowLevelGroups && currentRowLevelGroups.find(group => (group.offsetStart - 1) === rowIndex);
      onClick = onRowGroupButtonClick(rowGroup);

      const height = (rows[rowIndex] && rows[rowIndex].size) || defaultRowHeight;
      containerStyle = { height };
      lineStyle = {
        height: `calc(100% - ${height / 2}px)`,
        width: groupSize / 2,
        top: height / 2
      };
    } else {
      const currentColumnLevelGroups = columnsGroups[rowIndex];
      const columnGroup = currentColumnLevelGroups && currentColumnLevelGroups.find(group => (group.offsetStart - 1) === columnIndex);
      onClick = onColumnGroupButtonClick(columnGroup);

      const width = (columns[columnIndex] && columns[columnIndex].size) || defaultColumnWidth;
      containerStyle = { width };
      lineStyle = {
        width: `calc(100% - ${width / 2}px)`,
        left: width / 2,
        height: groupSize / 2
      }
    }
    return { lineStyle, containerStyle, onClick };
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
        type={type}
        containerStyle={containerStyle}
        lineStyle={lineStyle}
        collapsed={collapsed}
        onClick={onClick} />
  )
};

export default GroupLine;