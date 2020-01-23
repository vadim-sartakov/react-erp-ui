import { FunctionComponent, MouseEventHandler, Context } from 'react';

export interface Meta {
  type?: 'NUMBER' | 'GROUP';
  /** Width or height */
  size?: number;
  /** Whether current element expanded or collapsed */
  hidden?: number;
  /** Group level */
  level?: number
}

export interface Value {
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
export interface Group {
  start: number;
  /** Inclusive */
  end: number;
  /** Origin group start with offset caused by hidden items */
  offsetStart?: number;
  /** Origin group end with offset caused by hidden items */
  offsetEnd?: number;
  collapsed?: boolean;
}

export interface CellAddress {
  row?: number;
  column?: number;
}

export interface CellsRange {
  start: CellAddress;
  end: CellAddress;
}

export interface RowColumnNumberProps {
  type: 'row' | 'column';
  row: Meta;
  column: Meta;
  index: number;
  intersection?: boolean
}

/** Row number column component. If no index specified, then intersection area is rendered */
export const RowColumnNumber: FunctionComponent<RowColumnNumberProps>

export interface GroupLevelButtonProps {
  index: number;
  row: Meta;
  column: Meta;
  onClick: MouseEventHandler;
}

/** Row group level buttons which allows to manage expand/collapse state */
export const GroupLevelButton: FunctionComponent<GroupLevelButtonProps>

export interface GroupLineProps {
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
  onClick: MouseEventHandler;
  overscrolled: boolean;
}

/** Group line which located along with grouped items */
export const GroupLine: FunctionComponent<GroupLineProps>

export interface RenderOptions {
  /** Fixed columns vertical line */
  renderColumnsFixedArea: Function;
  /** Fixed rows horizontal line */
  renderRowsFixedArea: Function;
  /**
   * Empty area of rows and columns groups.
   * Would be rendered between groups of the same level and on intersection level
   */
  RowColumnNumberComponent?: FunctionComponent<RowColumnNumberProps>;
  /** Row group level buttons which allows to manage expand/collapse state */
  renderGroupEmptyArea: Function;
  GroupLevelButtonComponent?: FunctionComponent<GroupLevelButtonProps>;
  GroupLineComponent?: FunctionComponent<GroupLineProps>;
  renderCellValue: Function;
}

export interface SpreadsheetContextProps {
  onRowsChange: Function,
  onColumnsChange: Function,
  defaultColumnWidth: number,
  defaultRowHeight: number,
  groupSize: number,
  specialCellsBackgroundColor: string,
  fixRows: number,
  fixColumns: number,
  specialRowsCount: number,
  specialColumnsCount: number,
  scrollerTop: number,
  scrollerLeft: number
}
export const SpreadsheetContext: Context<SpreadsheetContextProps>

export interface SpreadsheetContainerProps {
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
export const SpreadsheetContainer: FunctionComponent<SpreadsheetContainerProps>

export interface UseSpreadsheetOptions {
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
export interface UseSpreadsheetResult {
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
export function useSpreadsheet(options: UseSpreadsheetOptions): UseSpreadsheetResult

interface UseSpreadsheetRenderOptions extends RenderOptions {
  value: Value[][];
  visibleRows: number[];
  visibleColumns: number[];
  rows: Meta[];
  columns: Meta[];
}
/** Renders spreadsheet elements by calling provided callbacks */
export function useSpreadsheetRender(options: UseSpreadsheetRenderOptions): JSX.Element

export interface SpreadsheetResizerProps {
  mode: 'row' | 'column';
  row?: Meta;
  column?: Meta
}
export const SpreadsheetResizer: FunctionComponent<SpreadsheetResizerProps>

export interface SpreadsheetCellProps {
  mergedRange?: CellsRange;
  rows: Meta[];
  columns: Meta[];
  /** Whether this cell is scrolled out or currently visible area */
  overscrolled?: Boolean;
  row: Meta;
  column: Meta;
}
export const SpreadsheetCell: FunctionComponent<SpreadsheetCellProps>

export interface SpreadsheetProps extends UseSpreadsheetOptions, RenderOptions {}
/**
 * Data grid, Excel-like spreadsheet component.
 * Integrated with [Scroller]{@link Scroller} to be able to handle large sets of data.
 * Supports resizing, fixing areas, cell merges and grouping
 */
declare const Spreadsheet: FunctionComponent<SpreadsheetProps>

export default Spreadsheet;