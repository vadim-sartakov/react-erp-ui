import { useScrollerOptionsBase } from '../Scroller/index';

export = Spreadsheet;

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
    end: number;
  }

  interface SpreadsheetContainerProps {
    onRowsChange?: Function,
    onColumnsChange?: Function,
    defaultColumnWidth: number,
    defaultRowHeight: number,
    fixRows?: number,
    fixColumns?: number
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

  interface renderOptions {
    rowIndex: number;
    columnIndex: number;
    row: Meta;
    column: Meta
  }

  /**
   * @returns SpreadsheetCell component
   */
  type renderCallback = (options: renderOptions) => JSX.Element

  interface useSpreadsheetRenderOptions {
    value: Value[][];
    visibleRows: number[];
    visibleColumns: number[];
    rows: Meta[];
    columns: Meta[];
    renderIntersectionColumn: renderCallback;
    renderColumnNumber: renderCallback;
    renderRowNumber: renderCallback;
    renderCellValue: renderCallback;
  }

  /** Renders spreadsheet elements by calling provided callbacks */
  function useSpreadsheetRender(options: useSpreadsheetRenderOptions): JSX.Element

  interface SpreadsheetCellProps {
    rowIndex: number;
    columnIndex: number;
    row: Meta;
    column: Meta;
    rows: Meta[];
    columns: Meta[];
    value: Value;    
  }

  /** Spreadsheet cell component. All render callbacks should return this component */
  function SpreadsheetCell(props: SpreadsheetCellProps): JSX.Element

  interface SpreadsheetProps extends useSpreadsheetOptions, SpreadsheetContainerProps {}

}