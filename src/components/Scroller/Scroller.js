import React from 'react';
import useScroller from './useScroller';
import ScrollerContainer from './ScrollerContainer';
import './types';

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 * @function
 * @memberof module:components/Scroller
 * @param {ScrollerProps} props [ScrollerProps]{@link module:components/Scroller~ScrollerProps}
 */
const Scroller = props => {
  const {
    gridStyles,
    scrollerContainerProps,
    elements
  } = useScroller(props);
  return (
    <ScrollerContainer {...props} {...scrollerContainerProps}>
      <div style={gridStyles}>
        {elements}
      </div>
    </ScrollerContainer>
  )
};

export default Scroller;