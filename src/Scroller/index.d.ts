import { CSSProperties, UIEventHandler, HTMLAttributes, FunctionComponent, Context } from 'react';

export interface Meta {
  size: number;
}

export interface ScrollerContextProps {
  defaultRowHeight: number;
  defaultColumnWidth: number;
}
export const ScrollerContext: Context<ScrollerContextProps>

export interface ScrollerContainerProps extends HTMLAttributes<{}> {
  width?: number;
  height: number;
  defaultRowHeight: number; 
  defaultColumnWidth: number;
  coverStyles: CSSProperties;
  pagesStyles: CSSProperties;
  gridStyles?: CSSProperties;
  onScroll: UIEventHandler;
}

/**
 * Scroller container component which creates scrollable container, also provides scroller context
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
  fixRows?: number;
  fixColumns?: number;
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
  loadedValues: any[];
  onScroll: UIEventHandler;
  coverStyles: CSSProperties;
  pagesStyles: CSSProperties;
  gridStyles: CSSProperties;
}

/**
 * Scroller hook which deals with all scroller state management 
 */
export function useScroller(options: UseScrollerOptions): UseScrollerResult

export interface ScrollerCellProps {
  rowIndex: number;
  columnIndex: number;
  row: Meta;
  column: Meta;
  value: any;
}

/**
 * Scroller cell unit
 */
export const ScrollerCell: FunctionComponent<ScrollerCellProps>

export interface ScrollerProps extends UseScrollerOptions {
  CellComponent: FunctionComponent<ScrollerCellProps>;
  value?: any[];
  width?: number;
  height: number;
}

/**
 * Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data.
 */
declare const Scroller: FunctionComponent<ScrollerProps>

export default Scroller;