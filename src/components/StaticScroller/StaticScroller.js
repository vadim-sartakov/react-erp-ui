import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const StaticScroller1 = ({
  ...props
}) => {
  return <div {...props} />
};

StaticScroller1.propTypes = {
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    height: PropTypes.number
  })).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    width: PropTypes.number
  })).isRequired
};

const StaticScroller = ({
  children,
  scrollTop,
  scrollLeft,
  ...props
}) => {

  const getRowsAndColumns = useCallback((scrollLeft, scrollTop) => {
    // Calculate object somehow
    return {
      rowsMeta: {},
      columnsMeta: {},
      rootStyle: {}
    }
  }, []);

  const [state, setState] = useState(() => getRowsAndColumns(scrollLeft, scrollTop));

  const handleScroll = e => {
    const nextState = getRowsAndColumns(e.scrollLeft, e.scrollTop);
    setState(nextState);
  };

  return state ? (
    <div {...props} onScroll={handleScroll}>
      {children(state)}
    </div>
  ) : null;
};