import { FunctionComponent, Dispatch, SetStateAction, Context, CSSProperties } from 'react';
import { Filter } from '../dataCompose/index';

export interface Selection {
  row: number;
  column?: number;
}

export interface Meta {
  size: number;
}

export interface TableContextProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  fixColumns: number;
}

export declare const TableContext: Context<TableContextProps>

export interface Column {
  /** Default is 'string' */
  type?: 'number' | 'boolean' | 'string' | 'date',
  /**
   * If value is an object, then result value for the table
   * will be received with provided valuePath
   */
  valuePath: string,
  format?: (value: any) => string;
  /** Custom value component */
  Component?: FunctionComponent<ValueComponentProps>;
  /** Header title */
  title: string;
  size?: number;
  HeaderComponent?: FunctionComponent<HeaderComponentProps>;
  FooterComponent?: FunctionComponent<FooterComponentProps>;
  footerValue?: (value: Value) => string;
}

export interface ValueComponentProps {
  value: any;
  rowIndex: number;
  columnIndex: number;
  column: Column;
  /** If mouse is over a row */
  hover: boolean;
  selectedRow: boolean;
  selectedCell: boolean;
}

export interface HeaderComponentProps {
  index: number;
  column: Column;
  onColumnsChange: Dispatch<SetStateAction<Column[]>>;
  defaultColumnWidth: number;
  style: CSSProperties;
}

export interface FooterComponentProps {
  value: Value;
  column: Column;
  style: CSSProperties;
}

export type Value = Object[];

export interface UseTableOptions {
  defaultRowHeight: number;
  defaultColumnWidth: number;
  totalRows: number;
  totalColumns: number[];
  rowsPerPage: number;
  columnsPerPage: number;
  fixRows?: number;
  fixColumns?: number;
  defaultValue?: Value;
  value?: Value;
  onChange?: Dispatch<SetStateAction<Value>>;
  columns: Column[];
  search?: string;
  searchIndex?: number;
  onSearchIndexChange?: number;
  filter: Filter;
  /** Array of property paths */
  sort: string[];
}

export interface UseTableResult {
  selectedCells: CellAddress[];
  columns: Column[];
  onColumnsChange: Dispatch<SetStateAction<Column[]>>;
  onSelectedCellsChange: Dispatch<SetStateAction<CellAddress[]>>;
  resizeInteraction: number;
  onResizeInteractionChange: Dispatch<SetStateAction<number>>;
  resizeColumns: Meta[];
  onResizeColumns: Dispatch<SetStateAction<Meta[]>>;
}

export declare function useTable(options: UseTableOptions): UseTableResult

export interface TableProps extends UseTableOptions {
  showFooter?: boolean;
}

declare const Table: FunctionComponent<TableProps>

export default Table;