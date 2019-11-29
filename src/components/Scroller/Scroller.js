import React from 'react';
import useScroller from './useScroller';
import ScrollerContainer from './ScrollerContainer';

/**
 * @typedef {import('./useScroller').useScrollerOptions | import('./ScrollerContainer').ScrollerContainerProps} ScrollerProps
 */

/**
 * 
 * @param {ScrollerProps} props
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