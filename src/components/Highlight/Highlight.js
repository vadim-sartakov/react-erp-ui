import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Highlight = ({
  search,
  highlightClassName,
  children
}) => {
  const parts = children.split(new RegExp(`(${search})`, 'gi'));
  return (
    <span>
      {parts.filter(part => part !== '').map((part, index) => {
        return (
          <span key={index} className={classNames({ [highlightClassName]: part.toLowerCase() === search.toLowerCase() }) }>
            {part}
          </span>
        )}
      )}
    </span>
  );
}

Highlight.propTypes = {
  search: PropTypes.string.isRequired,
  highlightClassName: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
};

Highlight.defaultProps = {
  highlightClassName: 'highlight'
};

export default Highlight;