import React from 'react';
import ResizeLinesView from './ResizeLinesView';
import { getCellsRangeSize } from '../../utils/gridUtils';

const ResizeLines = ({
  Component = ResizeLinesView,
  type,
  meta,
  index,
  defaultSize
}) => {

  const baseStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    top: 0,
    left: 0
  };

  const size = getCellsRangeSize({
    startIndex: 0,
    count: index + 1,
    defaultSize,
    meta
  });

  if (type === 'column') {
    const width = size;
    const style = {
      ...baseStyle,
      width,
      height: '100%'
    };
    return <Component type={type} style={style} />;
  } else if (type === 'row') {
    const height = size;
    const style = {
      ...baseStyle,
      width: '100%',
      height
    };
    return <Component type={type} style={style} />;
  }

};

export default ResizeLines;