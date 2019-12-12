import { ReactElement, HTMLAttributes, CSSProperties, ReactNode } from "react";

/**
 * Scroller Component
 */
export declare namespace Scroller {

  export interface Meta {
    size?: number;
    /** Offset for sticky positioning */
    offset?: number
  }

  export interface useScrollerProps {
    defaultRowHeight: number;
    defaultColumnWidth: number;
    totalRows: number;
    totalColumns :number[];
    rowsPerPage: number;
    columnsPerPage: number;
    rows?: Meta[];
    columns?: Meta[];
    /** Sync value */
    value?: any[][];
    /** When set to true whe height of scroller will expand on demand */
    lazy: boolean;
    /** Load async page callback */
    loadPage?: (page: number, itemsPerPage: number) => void;
    /** Render scroller cell callback. Should be memorized */
    renderCell?: (options: { row: Meta, column: Meta, value: any }) => ReactElement;
    fixRows?: number;
    fixColumns?: number
  }

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

  export interface useScrollerResult {
    /**
     * Values loaded asynchronously. Applicable only for 'async' mode
     * when 'loadPage' callback specified
     */
    loadedValues: any[][];
    rowsStartIndex: number; 
    columnsStartIndex: number;
    scrollerContainerProps: ScrollerContainerProps 
  }

  export interface ScrollerCellProps {
    Component?: any;
    row: Meta;
    column: Meta;
  }

  export interface ScrollerProps extends useScrollerProps, ScrollerContainerProps {}

}

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare function Scroller(props: Scroller.ScrollerProps): ReactNode

export default Scroller;