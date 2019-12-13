import { CSSProperties } from "react";

export as namespace Scroller;
export = Scroller;

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare function Scroller(props: Scroller.ScrollerProps): JSX.Element

declare namespace Scroller {
  interface Meta {
    size?: number;
    /** Offset for sticky positioning */
    offset?: number
  }

  interface ScrollerContainerProps {
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

  function ScrollerContainer(props: ScrollerContainerProps): JSX.Element;

  interface useScrollerOptions {
    defaultRowHeight: number;
    defaultColumnWidth: number;
    totalRows: number;
    totalColumns: number[];
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
    renderCell?: (options: { row: Meta, column: Meta, value: any }) => JSX.Element;
    fixRows?: number;
    fixColumns?: number
  }
  
  interface useScrollerResult {
    /**
     * Values loaded asynchronously. Applicable only for 'async' mode
     * when 'loadPage' callback specified
     */
    loadedValues: any[][];
    rowsStartIndex: number; 
    columnsStartIndex: number;
    scrollerContainerProps: ScrollerContainerProps 
  }

  function useScroller(options: useScrollerOptions): useScrollerResult

  interface ScrollerCellProps {
    Component?: any;
    row: Meta;
    column: Meta;
  }

  function ScrollerCell(props: ScrollerCellProps): JSX.Element

  interface ScrollerProps extends useScrollerOptions, ScrollerContainerProps {}
}