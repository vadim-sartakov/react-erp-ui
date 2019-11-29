import React from 'react';
import useScroller from './useScroller';
import ScrollerContainer from './ScrollerContainer';

/**
 * 
 * @param {import('./useScroller').useScrollerOptions | import('./ScrollerContainer').ScrollerContainerProps} props
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