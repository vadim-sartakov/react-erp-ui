import React from 'react';

const ResizeLinesView = ({ type, style }) => {
  const className = type === 'row' ? 'resize-line-row' : 'resize-line-column';
  return <div className={className} style={style} />;
};

export default ResizeLinesView;