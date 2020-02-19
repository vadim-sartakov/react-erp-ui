import { MutableRefObject, HTMLAttributes, Dispatch, SetStateAction, FunctionComponent, MouseEventHandler, Context, CSSProperties } from 'react';
import { ScrollerCellProps } from '../Scroller/index';
import { MergedCellProps } from '../grid/MergedCell/index';

export interface Font {
  name?: string;
  size?: number;
  bold: boolean;
  italic: boolean;
  color: string;
}

export interface BorderStyle {
  style: 'thin' | 'medium' | 'thick' ;
  color: string;
}

export interface Borders {
  top?: BorderStyle;
  left?: BorderStyle;
  bottom?: BorderStyle;
  right?: BorderStyle;
}

export interface Style {
  verticalAlign: 'top' | 'middle' | 'bottom';
  horizontalAlign: 'left' | 'center' | 'right';
  font: Font;
  border?: Borders;
  fill?: string;
  wrapText?: boolean;
}

export interface Meta {
  type?: 'NUMBER' | 'GROUP';
  /** Width or height */
  size?: number;
  /** Whether current element expanded or collapsed */
  hidden?: number;
  /** Group level */
  level?: number,
  style?: Style
}
export interface Cell {
  /** Value itself */
  value: any;
  /** 
   * Format callback which accepts value and should return react element
   * It could also be a string
   */
  format?: (value: any) => JSX.Element;
  /** Excel like formula */
  formula?: string;
  style?: Style;
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

export interface HeadingViewProps {
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
  cell: Cell
}

export interface ViewComponentsOptions {
  /** Value cell */
  CellComponent: FunctionComponent<CellComponentProps>;
  /** Rows and columns numbers */
  HeadingComponent?: FunctionComponent<HeadingViewProps>;
  HeadingsIntersectionComponent?: FunctionComponent<HTMLAttributes<{}>>;
  /** Row group level buttons which allows to manage expand/collapse state */
  GroupLevelButtonComponent?: FunctionComponent<GroupLevelButtonViewProps>;
  /** Group line which located along with grouped items */
  GroupLineComponent?: FunctionComponent<GroupLineViewProps>;
  SelectedRangeComponent?: FunctionComponent<{}>;
}

export interface SpreadsheetContextProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  groupSize: number;
  fixRows: number;
  fixColumns: number;
  cellBorderColor: number;
  hideGrid: boolean;
}
export const SpreadsheetContext: Context<SpreadsheetContextProps>

export interface UseSpreadsheetOptions {
  defaultCells?: Cell[][];
  cells?: Cell[][];
  onCellsChange?: Dispatch<SetStateAction<Cell[][]>>;
  /** Default value for internal state management */
  defaultRows?: Meta[];
  defaultColumns?: Meta[];
  /** If managing supposed to be by the upper component, passing value as prop */
  rows?: Meta[]; 
  columns?: Meta[];
  onRowsChange?: Dispatch<SetStateAction<Meta[]>>;
  onColumnsChange?: Dispatch<SetStateAction<Meta[]>>;
  selectedCells?: CellsRange[];
  onSelectedCellsChange?: Dispatch<SetStateAction<CellsRange[]>>;
  /** If set to 'true' than rows/columns numbers won't be rendered */
  hideHeadings?: boolean;
  /** Height of special row with column numbers */
  columnHeadingHeight?: number;
  /** Width of special column with row numbers */
  rowHeadingWidth?: number;
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
  cells: Cell[][];
  onCellsChange: Dispatch<SetStateAction<Cell>>;
  rows: Meta[];
  columns: Meta[];
  onColumnsChange: Dispatch<SetStateAction<Meta[]>>;
  onRowsChange: Dispatch<SetStateAction<Meta[]>>;
  selectedCells?: CellsRange[];
  onSelectedCellsChange?: Dispatch<SetStateAction<CellsRange[]>>;
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
  scrollerContainerRef: MutableRefObject<Element>;
  scrollerCoverRef: MutableRefObject<Element>;
  spreadsheetContainerRef: MutableRefObject<Element>;
}
export function useSpreadsheet(options: UseSpreadsheetOptions): UseSpreadsheetResult
export function useKeyboard(options: UseSpreadsheetOptions | UseSpreadsheetResult): KeyboardEvent
export function useMouse(options: UseSpreadsheetOptions | UseSpreadsheetResult): UIEvent

export const SpreadsheetCell: FunctionComponent<ScrollerCellProps | MergedCellProps>

export interface SpreadsheetProps extends UseSpreadsheetOptions, ViewComponentsOptions {
  /** When set to true - whole document will be rendered for printing */
  printMode: boolean;
  rowsPerPage: number;
  columnsPerPage: number;
  width?: number;
  height: number;
  defaultRowHeight: number;
  defaultColumnWidth: number;
  totalRows: number;
  totalColumns: number;
  cellBorderColor?: string;
  /** When set to 'true', default cell border will be hidden */
  hideGrid?: boolean;
}
/**
 * Data grid, Excel-like spreadsheet component.
 * Integrated with [Scroller]{@link Scroller} to be able to handle large sets of data.
 * Supports resizing, fixing areas, cell merges and grouping
 */
declare const Spreadsheet: FunctionComponent<SpreadsheetProps>

export default Spreadsheet;