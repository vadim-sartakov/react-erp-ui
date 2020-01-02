import { useScrollerOptionsBase } from '../Scroller/index';

export = Spreadsheet;

/**
 * Data grid, Excel-like spreadsheet component.
 * Integrated with [Scroller]{@link Scroller} to able to handle large sets of data.
 */
declare function Spreadsheet(props: Spreadsheet.SpreadsheetProps): JSX.Element

declare namespace Spreadsheet {
  interface Meta {
    type?: 'ROW_NUMBERS' | 'COLUMN_NUMBERS';
    /** Width or height */
    size?: number;
    /** Whether current element expanded or collapsed */
    hidden?: number;
    /** Group level */
    level?: number
  }

  interface Value {
    /** Value itself */
    value: any;
    /** 
     * Format callback which accepts value and should return react element
     * It could also be a string
     */
    format?: (value: any) => JSX.Element;
    /** Excel like formula */
    formula?: string
  }

  /** Group object describing grouped items range */
  interface Group {
    start: number;
    /** Inclusive */
    end: number;
  }

  interface CellAddress {
    row?: number;
    column?: number;
  }

  interface CellsRange {
    start: CellAddress;
    end: CellAddress;
  }

  interface SpreadsheetContainerProps {
    onRowsChange?: Function,
    onColumnsChange?: Function,
    defaultColumnWidth: number,
    defaultRowHeight: number,
    fixRows?: number,
    fixColumns?: number
  }

  interface RenderOptions {
    /** Intersection area of rows and columns numbers */
    renderRowColumnNumbersIntersection: renderCallback;
    /**
     * Empty area of rows and columns groups.
     * Would be rendered between groups of the same level and on intersection level
     * */
    renderGroupsEmptyArea: renderCallback;
    /** Group level buttons which allows to manage expand/collapse state */
    renderGroupButton: renderCallback;
    renderRowGroup: renderCallback;
    renderColumnGroup: renderCallback;
    renderColumnNumber: renderCallback;
    renderRowNumber: renderCallback;
    renderCellValue: renderCallback;
    mergedCells?: CellsRange[];
  }

  function SpreadsheetContainer(props: SpreadsheetContainerProps): JSX.Element

  interface useSpreadsheetOptions extends useScrollerOptionsBase {
    value?: Value[][];
    onChange?: Function;
    rows?: Meta[]; 
    columns?: Meta[];
    onRowsChange?: Function;
    onColumnsChange?: Function;
    /** If set to 'true' than rows/columns numbers won't be rendered */
    hideRowColumnNumbers?: boolean;
    /** Height of special row with column numbers */
    columnNumbersRowHeight?: number;
    /** Width of special column with row numbers */
    rowNumberColumnWidth?: number;
    columnGroupHeight?: number;
    rowGroupWidth?: number;
  }

  interface useSpreadsheetResult {
    spreadsheetContainerProps: SpreadsheetContainerProps;
    scrollerOptions: useScrollerOptionsBase
  }

  function useSpreadsheet(options: useSpreadsheetOptions): useSpreadsheetResult

  /**
   * Should return [SpreadsheetCell]{@link Spreadsheet.SpreadsheetCell} component as root.
   */
  type renderCallback = (options: {
    rows: Meta[];
    columns: Meta[];
    rowIndex: number;
    columnIndex: number;
    row: Meta;
    column: Meta;
    value: Value;
  }) => JSX.Element

  interface useSpreadsheetRenderOptions extends RenderOptions {
    value: Value[][];
    visibleRows: number[];
    visibleColumns: number[];
    rows: Meta[];
    columns: Meta[];
  }

  /** Renders spreadsheet elements by calling provided callbacks */
  function useSpreadsheetRender(options: useSpreadsheetRenderOptions): JSX.Element

  interface SpreadsheetCellProps {
    row: Meta;
    column: Meta;
  }

  /**
   * Integrated with [ScrollerCell]{@link Scroller.ScrollerCell}
   */
  function SpreadsheetCell(props: SpreadsheetCellProps): JSX.Element

  interface SpreadsheetProps extends useSpreadsheetOptions, RenderOptions, SpreadsheetContainerProps {}

}