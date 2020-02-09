import React, { useMemo, forwardRef } from 'react';
import { ScrollerContext } from './';

/** @type {import('react').FunctionComponent<import('.').ScrollerContainerProps>} */
const ScrollerContainer = forwardRef(({
  width,
  height,
  style,
  defaultRowHeight,
  defaultColumnWidth,
  ...props
}, ref) => {
  const contextValue = useMemo(() => ({
    defaultRowHeight,
    defaultColumnWidth
  }), [defaultRowHeight, defaultColumnWidth]);
  return (
    <ScrollerContext.Provider value={contextValue}>
      <div
          tabIndex="0"
          ref={ref}
          {...props}
          style={{ width, height, overflow: height && 'auto', ...style }} />
    </ScrollerContext.Provider>
  );
});

export default ScrollerContainer;