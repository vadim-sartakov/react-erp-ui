export = Spreadsheet;

/**
 * Data grid, Excel-like spreadsheet component.
 * Integrated with [Scroller]{@link Scroller} to be able to handle large sets of data.
 */
declare function Spreadsheet(props: Spreadsheet.SpreadsheetProps): JSX.Element

declare namespace Spreadsheet {
  interface Meta {
    type?: 'NUMBER' | 'GROUP';
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
    /** Origin group start with offset caused by hidden items */
    offsetStart?: number;
    /** Origin group end with offset caused by hidden items */
    offsetEnd?: number;
    collapsed?: boolean;
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
    onRowsChange?: Function;
    onColumnsChange?: Function;
    defaultColumnWidth: number;
    defaultRowHeight: number;
    groupSize: number;
    fixRows?: number;
    fixColumns?: number;
    specialRowsCount?: number;
    specialColumnsCount?: number;
    specialCellsBackgroundColor: string;
    scrollerTop: number;
    scrollerLeft: number;
  }

  type RowColumnNumber = (props : { type: 'row' | 'column', row: Meta, column: Meta, index: number, intersection: boolean }) => JSX.Element;

  /** Row group level buttons which allows to manage expand/collapse state */
  type GroupLevelButton = (props: { index: number, row: Meta, column: Meta, onClick: Function }) => JSX.Element;
  /** Group line which located along with grouped items */
  type GroupLine = (props: {
    type: 'row' | 'column';
    mergedRange: CellsRange;
    row: Meta;
    column: Meta;
    rows: Meta[];
    columns: Meta[];
    rowIndex: number;
    columnIndex: number;
    groupSize: number;
    collapsed: boolean;
    onClick: Function;
    overscrolled: boolean;
  }) => JSX.Element;

  interface RenderOptions {
    /** Fixed columns vertical line */
    renderColumnsFixedArea: RenderCallback;
    /** Fixed rows horizontal line */
    renderRowsFixedArea: RenderCallback;
    /**
     * Empty area of rows and columns groups.
     * Would be rendered between groups of the same level and on intersection level
     */
    RowColumnNumberComponent?: RowColumnNumber;
    /** Row group level buttons which allows to manage expand/collapse state */
    renderGroupEmptyArea: RenderCallback;
    GroupLevelButtonComponent?: GroupLevelButton;
    GroupLineComponent?: GroupLine;
    renderCellValue: RenderCallback;
  }

  function SpreadsheetContainer(props: SpreadsheetContainerProps): JSX.Element

  interface UseSpreadsheetOptions {
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
    /** 
     * Width and height of groups special rows and columns.
     * These areas serve for group buttons rendering and group lines.
     */
    groupSize?: number;
    mergedCells?: CellsRange[];
    totalRows: number;
    totalColumns: number;
    fixRows?: number;
    fixColumns?: number;
  }

  /**
   * Transformed input properties as well as additional properties.
   * Transformation is the offset of input values and occures when
   * special rows/columns (rows, columns numbers, groups) appeared
   */
  interface UseSpreadsheetResult {
    value: Value[][];
    onChange: Function;
    rows: Meta[];
    columns: Meta[];
    onColumnsChange: Function;
    onRowsChange: Function;
    totalRows: number;
    totalColumns: number;
    fixRows: number;
    fixColumns: number;
    mergedCells: CellsRange[];
    specialRowsCount: number;
    specialColumnsCount: number;
    rowsGroups: Group[];
    columnsGroups: Group[];
  }

  function useSpreadsheet(options: UseSpreadsheetOptions): UseSpreadsheetResult

  /**
   * Should return [SpreadsheetCell]{@link Spreadsheet.SpreadsheetCell} component as root.
   */
  type RenderCallback = (options: {
    rowIndex: number;
    columnIndex: number;
    row: Meta;
    column: Meta;
    value?: Value;
    overscrolled?: Boolean;
    mergedRange?: CellsRange;
  }) => JSX.Element

  interface UseSpreadsheetRenderOptions extends RenderOptions {
    value: Value[][];
    visibleRows: number[];
    visibleColumns: number[];
    rows: Meta[];
    columns: Meta[];
  }

  /** Renders spreadsheet elements by calling provided callbacks */
  function useSpreadsheetRender(options: UseSpreadsheetRenderOptions): JSX.Element

  interface SpreadsheetCellProps {
    mergedRange?: CellsRange;
    rows: Meta[];
    columns: Meta[];
    /** Whether this cell is scrolled out or currently visible */
    overscrolled?: Boolean;
    row: Meta;
    column: Meta;
  }

  interface SpreadsheetResizerProps {
    mode: 'row' | 'column';
    row?: Meta;
    column?: Meta
  }

  /**
   * Integrated with [ScrollerCell]{@link Scroller.ScrollerCell}
   */
  function SpreadsheetCell(props: SpreadsheetCellProps): JSX.Element

  interface SpreadsheetProps extends UseSpreadsheetOptions, RenderOptions {}

}