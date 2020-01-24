import React, { useContext, useCallback } from 'react';
import { SpreadsheetContext } from './';
import useResize from '../useResize';

const propertiesMap = {
  row: {
    defaultSize: 'defaultRowHeight',
    resizeProperty: 'height',
    otherResizeProperty: 'width',
    metaProp: 'row'
  },
  column: {
    defaultSize: 'defaultColumnWidth',
    resizeProperty: 'width',
    otherResizeProperty: 'height',
    metaProp: 'column'
  }
};

const SpreadsheetResizer = ({ mode, index, onChange, ...props }) => {
  const properties = propertiesMap[mode];
  const context = useContext(SpreadsheetContext);

  const defaultSize = context[properties.defaultSize];
  const metaProp = props[properties.metaProp];

  const sizes = { [properties.resizeProperty] : (metaProp && metaProp.size) || defaultSize, [properties.otherResizeProperty]: 0 };
  const handleSizesChange = useCallback(newSize => {
    const curSize = newSize[properties.resizeProperty];
    onChange(sizes => {
      const nextSizes = [...(sizes || [])];
      nextSizes[index] = { ...nextSizes[index], size: curSize };
      return nextSizes;
    });
  }, [index, onChange, properties.resizeProperty]);
  const onStartResize = useResize({ sizes, onSizesChange: handleSizesChange });
  return <div {...props} onMouseDown={onStartResize} />;
};

export default SpreadsheetResizer;