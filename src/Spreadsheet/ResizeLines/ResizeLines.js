import React from 'react';
import ResizeLinesView from './ResizeLinesView';
import { getCellsRangeSize } from '../../MergedCell/utils';

const ResizeLines = ({
  Component = ResizeLinesView,
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

  if (type === 'column') {
    const width = size;
    const style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      width,
      height: '100%',
      top: 0,
      left: 0
    };
    return (
      <div style={containerStyle}>
        <Component type={type} style={style} />
      </div>
    );
  } else if (type === 'row') {
    const height = size;
    const style = {
      position: index < fixCount ? 'sticky' : 'absolute',
      height,
      width: '100%',
      top: 0,
      left: 0
    };
    return (
      <div style={containerStyle}>
        <Component type={type} style={style} />
      </div>
    );
  }

};

export default ResizeLines;