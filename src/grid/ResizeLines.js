import React from 'react';
import { getCellsRangeSize } from './MergedCell/utils';

const ResizeLines = ({
  type,
  meta,
  fixCount,
  index,
  visibleIndexes,
  defaultSize
}) => {

  const containerStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    width: '100%',
    height: '100%'
  };

  const startIndex = visibleIndexes[0];

  const size = getCellsRangeSize({
    startIndex,
    count: (index + 1) - startIndex,
    defaultSize,
    meta
  });

  let className, style;

  if (type === 'column') {
    const width = size;
    className = 'resize-line-column';
    style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      width,
      height: '100%',
      top: 0,
      left: 0
    };
  } else if (type === 'row') {
    const height = size;
    className = 'resize-line-row';
    style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      height,
      width: '100%',
      top: 0,
      left: 0
    };
  }

  return (
    <div style={containerStyle}>
      <div className={className} style={style} />
    </div>
  );

};

export default ResizeLines;