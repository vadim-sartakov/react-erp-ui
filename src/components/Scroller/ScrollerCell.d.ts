import { ElementType } from "react";
import { Meta } from "./";

export interface ScrollerCellProps {
  Component?: any;
  row: Meta;
  column: Meta;
}

declare const ScrollerCell: ElementType<ScrollerCellProps>;

export default ScrollerCell;