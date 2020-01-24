import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { SpreadsheetContext, SpreadsheetCell } from '../';
import classes from './GroupLine.module.css';

const GroupLine = ({
  type,
  mergedRange,
  row,
  column,
  rows,
  columns,
  rowIndex,
  columnIndex,
  collapsed,
  onClick,
  overscrolled
}) => {
  const { specialCellsBackgroundColor, defaultRowHeight, defaultColumnWidth, groupSize } = useContext(SpreadsheetContext);
  
  const { lineProps, containerStyle } = useMemo(() => {
    let lineProps, containerStyle;
    if (type === 'row') {
      const height = (rows[rowIndex] && rows[rowIndex].size) || defaultRowHeight;
      containerStyle = { height };
      lineProps = {
        className: classes.verticalLine,
        style: {
          height: `calc(100% - ${height / 2}px)`,
          width: groupSize / 2,
          top: height / 2
        }
      };
    } else {
      const width = (columns[columnIndex] && columns[columnIndex].size) || defaultColumnWidth;
      containerStyle = { width };
      lineProps = {
        className: classes.horizontalLine,
        style: {
          width: `calc(100% - ${width / 2}px)`,
          left: width / 2,
          height: groupSize / 2
        }
      }
    }
    return { lineProps, containerStyle };
  }, [columnIndex, columns, rows, type, defaultColumnWidth, defaultRowHeight, groupSize, rowIndex]);

  return (
    <SpreadsheetCell
        row={row}
        column={column}
        rows={rows}
        columns={columns}
        mergedRange={mergedRange}
        overscrolled={overscrolled}>
      <div className={classes.root} style={{ backgroundColor: specialCellsBackgroundColor }}>
        <div className={classes.buttonContainer} style={{ ...containerStyle, backgroundColor: specialCellsBackgroundColor }}>
          <div className={classes.groupButton} style={{ backgroundColor: specialCellsBackgroundColor }} onClick={onClick}>
            {collapsed ? '+' : '-'}
          </div>
        </div>
        {!collapsed && <div {...lineProps} />}
      </div>
    </SpreadsheetCell>
  )
};

export default GroupLine;