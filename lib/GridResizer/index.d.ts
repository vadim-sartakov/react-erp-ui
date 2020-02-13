import { Dispatch, SetStateAction, FunctionComponent } from 'react';

export interface Meta {
  size: number;
}

export interface GridResizerProps {
  type: 'row' | 'column';
  index: number;
  defaultSize: number;
  meta: Meta,
  onChange: Dispatch<SetStateAction<Meta[]>>;
  Component: FunctionComponent | string;
  minSize: number;
  resizeMeta: Meta;
  onResizeMetaChange: Dispatch<SetStateAction<Meta[]>>;
}

declare const GridResizer: FunctionComponent<GridResizerProps>;

export default GridResizer;