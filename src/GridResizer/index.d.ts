import { SetStateAction, FunctionComponent, HTMLAttributes } from 'react';

export interface Meta {
  size: number;
}

export interface GridResizerProps extends HTMLAttributes<{}> {
  type: 'row' | 'column';
  index: number;
  defaultSize: number;
  meta: Meta,
  onChange: SetStateAction<Meta[]>;
  Component: FunctionComponent | string
}

declare const GridResizer: FunctionComponent<GridResizerProps>;

export default GridResizer;