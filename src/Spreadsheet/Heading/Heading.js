import React, { useCallback } from 'react';
import HeadingView from './HeadingView';
import { normalizeMergedRange } from '../../MergedCell';

const Heading = ({
  Component = HeadingView,
  selectedCells,
  onResizeInteractionChange,
  ...props
}) => {
  const { type, index } = props;
  const selected = selectedCells.some(selectedRange => {
    const normalizedSelectedRange = normalizeMergedRange(selectedRange);
    return index >= normalizedSelectedRange.start[type] && index <= normalizedSelectedRange.end[type]
  });

  const onMouseDown = useCallback(() => onResizeInteractionChange({ index: props.index, type: props.type }), [onResizeInteractionChange, props.index, props.type]);
  const onMouseUp = useCallback(() => onResizeInteractionChange(undefined), [onResizeInteractionChange]);

  return <Component {...props} selected={selected} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
};

export default Heading;