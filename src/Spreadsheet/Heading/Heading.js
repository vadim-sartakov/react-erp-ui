import React from 'react';
import HeadingView from './HeadingView';

const Heading = ({
  Component = HeadingView,
  selectedCells,
  ...props
}) => {
  const { type, index } = props;
  const selected = selectedCells.some(selectedRange => index >= selectedRange.start[type] && index <= selectedRange.end[type]);
  return <Component {...props} selected={selected} />
};

export default Heading;