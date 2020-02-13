import React from 'react';

const FixLinesView = ({ type, style }) => {
  const className = type === 'rows' ? 'fixed-rows' : 'fixed-columns'
  return <div className={className} style={style} />;
};

export default FixLinesView;