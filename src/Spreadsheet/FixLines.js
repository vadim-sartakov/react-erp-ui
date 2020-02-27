import React, { useContext } from 'react';
import { SpreadsheetContext } from '.';
import { getCellsRangeSize } from '../grid/MergedCell/utils';

const FixLines = ({
  rows,
  columns,
  specialRowsCount,
  specialColumnsCount
}) => {
  const result = [];
  const { defaultRowHeight, defaultColumnWidth, fixRows, fixColumns } = useContext(SpreadsheetContext);

  const containerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    zIndex: 10
  };

  const baseFixedAreaStyle = {
    position: 'sticky',
    top: 0,
    left: 0,
  };

  if (fixColumns - specialColumnsCount) {
    const width = getCellsRangeSize({
      startIndex: 0,
      count: fixColumns,
      defaultSize: defaultColumnWidth,
      meta: columns
    });
    const style = {
      ...baseFixedAreaStyle,
      width,
      height: '100%'
    };
    result.push((
      <div key="fixed_columns" style={containerStyle}>
        <div className="fixed-columns" style={style} />
      </div>
    ));
  }

  if (fixRows - specialRowsCount) {
    const height = getCellsRangeSize({
      startIndex: 0,
      count: fixRows,
      defaultSize: defaultRowHeight,
      meta: rows
    });
    const style = {
      ...baseFixedAreaStyle,
      width: '100%',
      height
    };
    result.push((
      <div key="fixed_rows" style={containerStyle}>
        <div className="fixed-rows" style={style} />
      </div>
    ));
  }

  return result;
};

export default FixLines;