import { Meta } from "./";
import { ScrollerContainerProps } from "./ScrollerContainer";

export interface useScrollerOptions {
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
  renderCell?: (options: { row: Meta, column: Meta, value: any }) => ReactElement;
  fixRows?: number;
  fixColumns?: number
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

export default function useScroller(options: useScrollerOptions): useScrollerResult;