import { ElementType } from "react"

export interface ScrollerContainerProps {
  width?: number;
  height: number;
  coverProps: any; 
  pagesProps: any; 
  defaultRowHeight: number; 
  defaultColumnWidth: number;
  onScroll: Function;
  coverStyles: CSSProperties;
  pagesStyles: CSSProperties;
}

declare const ScrollerContainer: ElementType<ScrollerContainerProps>;

export default ScrollerContainer;