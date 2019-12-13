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

declare function ScrollerContainer(props: ScrollerContainerProps): JSX.Element;

export default ScrollerContainer;