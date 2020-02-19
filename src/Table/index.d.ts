import { FunctionComponent, Dispatch, SetStateAction, MutableRefObject, Context } from 'react';
import { Filter } from '../dataCompose/index';

export interface CellAddress {
  row: number;
  column: number;
}

export interface Meta {
  size?: number;
}

export interface TableContextProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  fixRows: number;
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
  valuePath?: string,
  format?: (value: any) => string;
  /** Custom value component */
  Component?: FunctionComponent<ValueComponentProps>;
  /** Header title */
  title: string;
  HeaderComponent?: FunctionComponent<HeaderComponentProps>;
  headerRowSpan?: number;
  headerColumnSpan?: number;
}

export interface ValueComponentProps {
  value: any;
  rowIndex: number;
  columnIndex: number;
  column: Column;
}

export interface HeaderComponentProps {
  rowIndex: number;
  columnIndex: number;
  column: Column;
}

export type Value = any[][];

export interface UseTableOptions {
  defaultRowHeight: number;
  defaultColumnWidth: number;
  totalRows: number;
  totalColumns: number[];
  rowsPerPage: number;
  columnsPerPage: number;
  defaultValue?: Value;
  value?: Value;
  onChange?: Dispatch<SetStateAction<Value>>;
  /** Number of header rows. Will help to create table headers with merged cells */
  headerRows?: number;
  filter: Filter;
  /** Array of property paths */
  sort: string[];
}

export interface UseTableResult {
  selectedCells: CellAddress[];
  onSelectedCellsChange: Dispatch<SetStateAction<CellAddress[]>>;
  columns: Meta[];
}

export declare function useTable(UseTableOptions): UseTableResult

export interface TableProps extends UseTableOptions {

}

declare const Table: FunctionComponent<TableProps>

export default Table;