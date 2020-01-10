import { CSSProperties, ElementType } from "react";

export = Scroller;
export as namespace Scroller;

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

  /**
   * Scroller container which also creates scroller context
   */
  function ScrollerContainer(props: ScrollerContainerProps): JSX.Element;

  interface UseScrollerOptionsBase {
    defaultRowHeight: number;
    defaultColumnWidth: number;
    totalRows: number;
    totalColumns: number[];
    rowsPerPage: number;
    columnsPerPage: number;
    rows?: Meta[];
    columns?: Meta[];
    fixRows?: number;
    fixColumns?: number
  }

  interface UseScrollerOptions extends UseScrollerOptionsBase {
    /** Sync value */
    value?: any[][];
    /** When set to true whe height of scroller will expand on demand */
    lazy?: boolean;
    /** Load async page callback */
    loadPage?: (page: number, itemsPerPage: number) => void;
    /** Render scroller cell callback. Should be memorized */
    renderCell?: (options: { row: Meta, column: Meta, value: any }) => JSX.Element;
  }
  
  interface UseScrollerResult {
    /** Rows indexes */
    visibleRows: number[],
    /** Columns indexes */
    visibleColumns: number[],
    /** Rows meta with added offset */
    rows?: Meta[],
    /** Columns meta with added offset */
    columns?: Meta[]
    /**
     * Values loaded asynchronously. Applicable only for 'async' mode
     * when 'loadPage' callback specified
     */
    loadedValues: any[][];
    rowsStartIndex: number; 
    columnsStartIndex: number;
    /** CSS grid styles. Should be passed to grid container */
    gridStyles: CSSProperties;
    /** Rendered elements. Calculated when 'renderCell' is specified */
    elements: JSX.Element;
    scrollerContainerProps: ScrollerContainerProps 
  }

  /**
   * Scroller hook which deals with all scroller state management 
   */
  function useScroller(options: UseScrollerOptions): UseScrollerResult

  interface ScrollerCellProps {
    Component?: ElementType;
    row: Meta;
    column: Meta;
  }

  function ScrollerCell(props: ScrollerCellProps): JSX.Element

  interface ScrollerProps extends UseScrollerOptions, ScrollerContainerProps {}
}