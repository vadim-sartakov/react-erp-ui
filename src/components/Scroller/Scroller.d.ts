import { ElementType } from "react";

export interface ScrollerProps extends useScrollerProps, ScrollerContainerProps {}

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare const Scroller: ElementType<ScrollerProps>;

export default Scroller;