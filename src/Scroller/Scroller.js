import React from 'react';
import useScroller from './useScroller';
import ScrollerContainer from './ScrollerContainer';
import useScrollerRender from './useScrollerRender';

/** @type {import('./')} */
const Scroller = props => {
  const scrollerContainerProps = useScroller(props);
  const elements = useScrollerRender({ ...props, ...scrollerContainerProps });
  return (
    <ScrollerContainer {...props} {...scrollerContainerProps}>
      {elements}
    </ScrollerContainer>
  )
};

export default Scroller;