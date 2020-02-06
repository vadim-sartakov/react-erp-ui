import React from 'react';
import HeadingView from './HeadingView';
import { normalizeMergedRange } from '../../MergedCell';

const Heading = ({
  Component = HeadingView,
  selectedCells,
  ...props
}) => {
  const { type, index } = props;
  const selected = selectedCells.some(selectedRange => {
    const normalizedSelectedRange = normalizeMergedRange(selectedRange);
    return index >= normalizedSelectedRange.start[type] && index <= normalizedSelectedRange.end[type]
  });
  return <Component {...props} selected={selected} />
};

export default Heading;