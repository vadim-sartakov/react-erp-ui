import React, { useCallback } from 'react';
import useResize from '../useResize';

const setMeta = ({ index, resizeProperty, minSize, onChange, beforeCallback }) => newSize => {
  beforeCallback && beforeCallback();
  const curSize = Math.max(newSize[resizeProperty], minSize);
  onChange(sizes => {
    const nextSizes = [...(sizes || [])];
    nextSizes[index] = { ...nextSizes[index], size: curSize };
    return nextSizes;
  });
};

const GridResizer = ({
  type,
  index,
  defaultSize,
  meta,
  onChange,
  resizeMeta,
  onMouseDown,
  onMouseUp,
  onResize,
  Component = 'div',
  minSize = 10,
  ...props
}) => {
  let resizeProperty, otherResizeProperty;
  if (type === 'row') {
    resizeProperty = 'height';
    otherResizeProperty = 'width';
  } else {
    resizeProperty = 'width';
    otherResizeProperty = 'height';
  }

  const sizes = { [resizeProperty] : (meta && meta.size) || defaultSize, [otherResizeProperty]: 0 };

  const handleMouseMove = useCallback(setMeta({ index, resizeProperty, minSize, onChange: onResize }), [index, onChange, resizeProperty, minSize]);
  const handleMouseUp = useCallback(setMeta({ index, resizeProperty, minSize, onChange, beforeCallback: onMouseUp }), [index, onChange, resizeProperty, minSize]);

  const onStartResize = useResize({ sizes, onMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp });
  return <Component {...props} onMouseDown={onStartResize} />;
};

export default GridResizer;