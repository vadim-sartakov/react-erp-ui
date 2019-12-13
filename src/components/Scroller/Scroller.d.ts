import { ElementType } from "react";
import { useScrollerOptions } from './useScroller';
import { ScrollerContainerProps } from './ScrollerContainer';

export interface ScrollerProps extends useScrollerOptions, ScrollerContainerProps {}

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare function Scroller(props: ScrollerProps): JSX.Element;

export default Scroller;