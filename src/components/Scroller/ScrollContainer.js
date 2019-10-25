import React, { useContext } from 'react';
import ScrollContext from './ScrollerContext';

const ScrollContainer = ({
  width,
  height,
  children,
  coverProps,
  pagesProps,
  style,
  ...props
}) => {
  const {
    onScroll,
    coverStyles,
    pagesStyles
  } = useContext(ScrollContext);
  return (
    <div onScroll={onScroll} {...props} style={{ width, height, overflow: 'auto', ...style }}>
      <div {...coverProps} style={{ ...(coverProps && coverProps.styles), ...coverStyles }}>
        <div {...pagesProps} style={{ ...(pagesProps && pagesProps.pages), ...pagesStyles }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollContainer;