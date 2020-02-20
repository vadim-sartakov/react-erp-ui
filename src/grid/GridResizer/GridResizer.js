import React, { useCallback } from 'react';
import useResize from '../../useResize';

const setMeta = ({ index, resizeProperty, minSize, onChange }) => newSize => {
  if (!onChange) return;
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
  onMouseDown,
  onMouseMove,
  onMouseUp,
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

  const handleMouseMove = useCallback(setMeta({ index, resizeProperty, minSize, onChange: onMouseMove }), [index, onMouseMove, resizeProperty, minSize]);
  const handleMouseUp = useCallback(setMeta({ index, resizeProperty, minSize, onChange: onMouseUp }), [index, onMouseUp, resizeProperty, minSize]);

  const onStartResize = useResize({ sizes, onMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp });
  return <Component {...props} onMouseDown={onStartResize} />;
};

export default GridResizer;