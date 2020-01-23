import React from 'react';
import { useScroller, useScrollerRender, ScrollerContainer } from './';

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