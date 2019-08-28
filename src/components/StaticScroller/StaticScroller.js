import React from 'react';
import PropTypes from 'prop-types';

const StaticScroller = ({
  ...props
}) => {
  return <div {...props} />
};

StaticScroller.propTypes = {
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