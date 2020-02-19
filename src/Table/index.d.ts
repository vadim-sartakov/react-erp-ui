import { FunctionComponent } from 'react';

export interface Meta {
  size?: number;
}

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

export interface UseTableOptions {
  defaultRowHeight: number;
  defaultColumnWidth: number;
  totalRows: number;
  totalColumns: number[];
  rowsPerPage: number;
  columnsPerPage: number;
  value: any[][];
  /** Number of header rows. Will help to create table headers with merged cells */
  headerRows?: number;
}

export interface UseTableResult {
  columns: Meta[];
}

export declare function useTable(UseTableOptions): UseTableResult

export interface TableProps extends UseTableOptions {

}

declare const Table: FunctionComponent<TableProps>

export default Table;