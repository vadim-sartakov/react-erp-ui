import React, { useCallback } from 'react';
import HeadingView from './HeadingView';
import { normalizeMergedRange } from '../../grid/MergedCell';

const Heading = React.memo(({
  Component = HeadingView,
  onResizeInteractionChange,
  onChange,
  ...props
}) => {
  const selected = props.selectedCells.some(selectedRange => {
    const normalizedSelectedRange = normalizeMergedRange(selectedRange);
    return props.index >= normalizedSelectedRange.start[props.type] && props.index <= normalizedSelectedRange.end[props.type]
  });

  const onMouseDown = useCallback(() => onResizeInteractionChange({ index: props.index, type: props.type }), [onResizeInteractionChange, props.index, props.type]);
  const onMouseUp = useCallback(nextSizes => {
    onChange(nextSizes);
    onResizeInteractionChange(undefined);
  }, [onChange, onResizeInteractionChange]);

  return <Component {...props} selected={selected} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
});

export default Heading;