import { HTMLAttributes, Dispatch, SetStateAction, FunctionComponent, MouseEventHandler, Context, CSSProperties } from 'react';

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

export interface FixLinesViewProps {
  type: 'rows' | 'columns';
  style: CSSProperties;
}

export interface RowColumnNumberViewProps {
  type: 'row' | 'column';
  defaultSize: number;
  onChange: Dispatch<SetStateAction<Meta[]>>;
  meta: Meta;
  index: number;
}

export interface GroupLevelButtonViewProps {
  index: number;
  onClick: MouseEventHandler;
}

export interface GroupLineViewProps {
  type: 'row' | 'column';
  backgroundColor: string;
  containerStyle: CSSProperties;
  lineStyle: CSSProperties;
  collapsed: boolean;
  onClick: MouseEventHandler;
}

export interface CellComponentProps {
  value: Value
}

export interface ViewComponentsOptions {
  /** Value cell */
  CellComponent: FunctionComponent<CellComponentProps>;
  /** Fixed rows and columns lines */
  FixLinesComponent?: FunctionComponent<FixLinesViewProps>;
  /** Rows and columns numbers */
  RowColumnNumberComponent?: FunctionComponent<RowColumnNumberViewProps>;
  RowColumnNumberIntersectionComponent?: FunctionComponent<HTMLAttributes<{}>>;
  /** Empty area of special rows and columns  */
  SpecialCellEmptyAreaComponent: FunctionComponent<HTMLAttributes<{}>>;
  /** Row group level buttons which allows to manage expand/collapse state */
  GroupLevelButtonComponent?: FunctionComponent<GroupLevelButtonViewProps>;
  /** Group line which located along with grouped items */
  GroupLineComponent?: FunctionComponent<GroupLineViewProps>;
}

export interface SpreadsheetContextProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  groupSize: number;
  fixRows: number;
  fixColumns: number;
}
export const SpreadsheetContext: Context<SpreadsheetContextProps>

export interface SpreadsheetContainerProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  groupSize: number;
  fixRows: number;
  fixColumns: number;
  specialRowsCount: number;
  specialColumnsCount: number;
}
export const SpreadsheetContainer: FunctionComponent<SpreadsheetContainerProps>

export interface UseSpreadsheetOptions {
  value?: Value[][];
  onChange?: Dispatch<SetStateAction<Value[][]>>;
  rows?: Meta[]; 
  columns?: Meta[];
  onRowsChange?: Dispatch<SetStateAction<Meta[]>>;
  onColumnsChange?: Dispatch<SetStateAction<Meta[]>>;
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
export type GroupLevelButtonClickHandlerFactory = (level: number) => MouseEventHandler;
export type GroupButtonClickHandlerFactory = (group: Group) => MouseEventHandler;
/**
 * Transformed input properties as well as additional properties.
 * Transformation is the offset of input values and occures when
 * special rows/columns (rows, columns numbers, groups) appeared
 */
export interface UseSpreadsheetResult {
  value: Value[][];
  onChange: Dispatch<SetStateAction<Value>>;
  rows: Meta[];
  columns: Meta[];
  onColumnsChange: Dispatch<SetStateAction<Meta[]>>;
  onRowsChange: Dispatch<SetStateAction<Meta[]>>;
  totalRows: number;
  totalColumns: number;
  fixRows: number;
  fixColumns: number;
  mergedCells: CellsRange[];
  specialRowsCount: number;
  specialColumnsCount: number;
  rowsGroups: Group[];
  columnsGroups: Group[];
  onRowGroupLevelButtonClick: GroupLevelButtonClickHandlerFactory;
  onColumnGroupLevelButtonClick: GroupLevelButtonClickHandlerFactory;
  onRowGroupButtonClick: GroupButtonClickHandlerFactory;
  onColumnGroupButtonClick: GroupButtonClickHandlerFactory;
}
export function useSpreadsheet(options: UseSpreadsheetOptions): UseSpreadsheetResult

export interface SpreadsheetProps extends UseSpreadsheetOptions, ViewComponentsOptions {}
/**
 * Data grid, Excel-like spreadsheet component.
 * Integrated with [Scroller]{@link Scroller} to be able to handle large sets of data.
 * Supports resizing, fixing areas, cell merges and grouping
 */
declare const Spreadsheet: FunctionComponent<SpreadsheetProps>

export default Spreadsheet;