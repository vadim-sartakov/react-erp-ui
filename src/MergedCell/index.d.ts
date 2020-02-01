import { FunctionComponent } from 'react';

export interface Meta {
  size: number;
}

export interface CellAddress {
  row?: number;
  column?: number;
}

export interface CellsRange {
  start: CellAddress;
  end: CellAddress;
}

export interface MergedCellProps {
  defaultRowHeight: number;
  defaultColumnWidth: number;
  mergedRange: CellsRange;
  rows: Meta[];
  columns: Meta[];
  fixRows;
  fixColumns;
  scrollerTop;
  scrollerLeft;
}

/**
 * Helps to render merged cells range in grid components.
 * Calculates proper position and result size.
 */
declare const MergedCell: FunctionComponent<MergedCellProps>;

export default MergedCell;