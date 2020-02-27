import { FunctionComponent, Dispatch, SetStateAction, Context, CSSProperties, MutableRefObject } from 'react';

export interface CellAddress {
  row: number;
  column?: number;
}

export interface Meta {
  size: number;
}

export type ValueType = 'number' | 'boolean' | 'string' | 'date'

export interface TableContextProps {
  defaultColumnWidth: number;
  defaultRowHeight: number;
  fixColumns: number;
}

export declare const TableContext: Context<TableContextProps>

export interface CellComponentProps {
  value: any;
  rowIndex: number;
  column: Column;
  onMouseEnter: UIEvent;
  onMouseLeave: UIEvent;
  onClick: UIEvent;
  onDoubleClick: UIEvent;
}

export interface CellEditComponentProps {
  value: any;
  onChange: (value: any) => void;
  rowIndex: number;
  column: Column;
  createOnBlur: (value: any) => MouseEvent;
  /**
   * Helper function to initialize on key down event handler.
   * It's already bound to generic keys, so default actions will be executed.
   * If handler returned from this creator is used
   */
  createOnKeyDown: (value: any) => KeyboardEvent;
}

export interface Column {
  /** Default is 'string' */
  type?: ValueType;
  /**
   * If value is an object, then result value for the table
   * will be received with provided path
   */
  path: string;
  format?: (value: any) => string;
  /** Custom value component */
  Component?: FunctionComponent<CellComponentProps>;
  EditComponent?: FunctionComponent<CellEditComponentProps>;
  /** Header title */
  title: string;
  size?: number;
  HeaderComponent?: FunctionComponent<HeaderComponentProps>;
  FooterComponent?: FunctionComponent<FooterComponentProps>;
  footerValue?: (value: Value) => string;
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
  defaultValue?: Value;
  value?: Value;
  onChange?: Dispatch<SetStateAction<Value>>;
  defaultRowHeight: number;
  defaultColumnWidth: number;
  rowsPerPage: number;
  columnsPerPage: number;
  fixRows?: number;
  fixColumns?: number;
  columns: Column[];
  search?: string;
}

export interface UseTableResult {
  value: Value;
  totalRows: number;
  totalColumns: number;
  onChange: Dispatch<SetStateAction<Value>>;
  scrollerContainerRef: MutableRefObject<Element>;
  selectedCells: CellAddress[];
  onSelectedCellsChange: Dispatch<SetStateAction<CellAddress[]>>;
  columns: Column[];
  onColumnsChange: Dispatch<SetStateAction<Column[]>>;
  /** Which cell is currently editing */
  editingCell: CellAddress;
  onEditingCellChange: Dispatch<SetStateAction<CellAddress>>;
}

export declare function useTable(options: UseTableOptions): UseTableResult
export declare function useKeyboard(options: UseTableOptions | UseTableResult): UIEvent

export interface TableProps extends UseTableOptions {
  showFooter?: boolean;
  /** If true, then table is not editable */
  readOnly?: boolean;
  /**
   * Default edit components which will be used in edit mode.
   * The fallback is the EditComponent of column's prop.
   * If none was found then cell is supposed to be non-editable
   */
  defaultEditComponents?: {
    string: FunctionComponent<CellEditComponentProps>,
    number: FunctionComponent<CellEditComponentProps>,
    boolean: FunctionComponent<CellEditComponentProps>,
    date: FunctionComponent<CellEditComponentProps>
  };
  onRowAdd?: Function;
}

declare const Table: FunctionComponent<TableProps>

export default Table;