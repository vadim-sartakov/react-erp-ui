import React, { useCallback } from 'react';
import useResize from '../useResize';

const GridResizer = ({ type, index, defaultSize, meta, onChange, Component = 'div', ...props }) => {
  let resizeProperty, otherResizeProperty;
  if (type === 'row') {
    resizeProperty = 'height';
    otherResizeProperty = 'width';
  } else {
    resizeProperty = 'width';
    otherResizeProperty = 'height';
  }

  const sizes = { [resizeProperty] : (meta && meta.size) || defaultSize, [otherResizeProperty]: 0 };
  const handleSizesChange = useCallback(newSize => {
    const curSize = newSize[resizeProperty];
    onChange(sizes => {
      const nextSizes = [...(sizes || [])];
      nextSizes[index] = { ...nextSizes[index], size: curSize };
      return nextSizes;
    });
  }, [index, onChange, resizeProperty]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <Component {...props} onMouseDown={onStartResize} />;
};

export default GridResizer;