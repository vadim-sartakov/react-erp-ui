import { ElementType } from "react";
import { Meta } from "./";

export interface ScrollerCellProps {
  Component?: any;
  row: Meta;
  column: Meta;
}

declare function ScrollerCell(props: ScrollerCellProps): JSX.Element;

export default ScrollerCell;