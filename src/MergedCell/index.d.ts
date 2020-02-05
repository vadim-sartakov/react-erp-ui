import { FunctionComponent, CSSProperties } from 'react';

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
  fixRows: number;
  fixColumns: number;
  scrollerTop: number;
  scrollerLeft: number;
  /** Leave nodes with pointer events: 'none' value */
  noPointerEvents: boolean;
  /** Styles which will be applied to resulted root component */
  rootStyle: CSSProperties;
}

export function normalizeMergedRange(mergedRange: CellsRange);

/**
 * Helps to render merged cells range in grid components.
 * Calculates proper position and result size.
 */
declare const MergedCell: FunctionComponent<MergedCellProps>;

export default MergedCell;