import { CSSProperties, ElementType, UIEventHandler, HTMLAttributes, FunctionComponent } from 'react';

export = Scroller;

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare function Scroller(props: Scroller.ScrollerProps): JSX.Element;

declare namespace Scroller {

  export interface Meta {
    size: number;
  }

  export interface ScrollerContainerProps extends HTMLAttributes<{}> {
    width?: number;
    height: number;
    defaultRowHeight: number; 
    defaultColumnWidth: number;
    coverStyles: CSSProperties;
    pagesStyles: CSSProperties;
    onScroll: UIEventHandler;
  }

  /**
   * Scroller container which also creates scroller context
   */
  export const ScrollerContainer: FunctionComponent<ScrollerContainerProps>

  export interface ScrollerOptionsBase {
    defaultRowHeight: number;
    defaultColumnWidth: number;
    totalRows: number;
    totalColumns: number[];
    rowsPerPage: number;
    columnsPerPage: number;
    rows?: Meta[];
    columns?: Meta[];
  }

  export interface UseScrollerOptions extends ScrollerOptionsBase {
    /** When set to true whe height of scroller will expand on demand */
    lazy?: boolean;
    /** Load async page callback */
    loadPage?: (page: number, itemsPerPage: number) => void;
  }

  export interface UseScrollerResult {
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
    onScroll: Function;
    coverStyles: CSSProperties;
    pagesStyles: CSSProperties;
    gridStyles: CSSProperties;
  }

  /**
   * Scroller hook which deals with all scroller state management 
   */
  export function useScoller(options: UseScrollerOptions): UseScrollerResult

  export interface useScrollerRenderOptions {
    CellComponent: (props: { rowIndex: number, columnIndex: number }) => JSX.Element,
    visibleRows: number[];
    visibleColumns: number[];
    loadedValues: any[][];
    rows: Meta[];
    columns: Meta[];
    value?: any[][];
  }

  export function useScrollerRender(options: useScrollerRenderOptions): JSX.Element

  export interface ScrollerCellProps {
    Component?: ElementType;
    rowIndex: number;
    columnIndex: Meta;
  }

  export const ScrollerCell: FunctionComponent<ScrollerCellProps>

  export interface ScrollerProps extends UseScrollerOptions {
    width?: number;
    height: number;
  }

}