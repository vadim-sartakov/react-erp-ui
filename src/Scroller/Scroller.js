import React from 'react';
import useScroller from './useScroller';
import ScrollerContainer from './ScrollerContainer';
import useScrollerRender from './useScrollerRender';

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