import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const COLUMNS_MODE = 'columns';
const ROWS_MODE = 'rows';

const properties = mode => {
  if (mode === COLUMNS_MODE) {
    return {
      size: 'offsetWidth',
      startPadding: 'paddingLeft',
      endPadding: 'paddingRight',
      coordinate: 'clientX'
    }
  } else if (mode === ROWS_MODE) {
    return {
      size: 'offsetHeight',
      startPadding: 'paddingTop',
      endPadding: 'paddingBottom',
      coordinate: 'clientY'
    }
  }
};

const getNodePaddings = (mode, node) => {
  const computedStyle = getComputedStyle(node);
  const { startPadding, endPadding } = properties(mode);
  return parseFloat(computedStyle[startPadding] || '0') + parseFloat(computedStyle[endPadding] || '0');
};

const calculateOffset = (mode, rootRef, fixCells, sizes) => {
  const offset = [];
  const { size } = properties(mode);
  if (!rootRef || !rootRef.current) return [];
  const allSiblingNodes = rootRef.current.children;
  for (let i = 0; i < fixCells; i++) {
    if (i === 0) {
      offset.push(0);
      continue;
    }
    // Taking either html node size or calculated due to resizing size
    const prevNodeSize = ( sizes && sizes[i - 1] ) || allSiblingNodes[i - 1][size];
    const prevOffset = offset[i - 1];
    offset.push(prevOffset + prevNodeSize);
  }
  return offset;
};

const calculateSizes = (mode, interaction, sourceSize, event) => {
  const { coordinate } = properties(mode);
  const diff = event[coordinate] - interaction.startCoordinate;

  const size = [...sourceSize];
  const sizeWithPaddings = [];

  size[interaction.index] = interaction.curStartSize + diff;
  sizeWithPaddings[interaction.index] = size[interaction.index] + interaction.curPadding;

  if (interaction.nextStartSize) {
    size[interaction.index + 1] = interaction.nextStartSize - diff;
    sizeWithPaddings[interaction.index + 1] = size[interaction.index + 1] + interaction.nextPadding;
  }
  
  return { size, sizeWithPaddings };
};

const TableContext = createContext();

export const Table = ({
  fixRows,
  fixColumns,
  ...props
}) => {
  const [interaction, setInteraction] = useState();
  const [dimensions, setDimensions] = useState({
    columns: {
      size: [],
      offset: []
    },
    rows: {
      size: [],
      offset: []
    }
  });
  return (
    <TableContext.Provider value={{
      interaction,
      setInteraction,
      dimensions,
      setDimensions
    }}>
      <table {...props} />
    </TableContext.Provider>
  )
};
Table.propTypes = {
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number
};

export const TableHeader = props => <thead {...props} />;
export const TableBody = props => <tbody {...props} />;
export const TableRow = ({ style = {}, index, ...props }) => {
  const { dimensions } = useContext(TableContext);
  const height = dimensions.rows.size[index];
  const nextStyle = { ...style, height };
  return <tr {...props} style={nextStyle} />;
};
export const TableHeaderCell = ({ style = {}, index, ...props }) => {
  const { dimensions } = useContext(TableContext);
  const width = dimensions.columns.size[index];
  const nextStyle = { ...style, width };
  return <th {...props} style={nextStyle} />;
};
export const TableCell = props => <td {...props} />;

const TableResizer = ({ mode, index, fix, ...props }) => {
  const { interaction, setInteraction, setDimensions } = useContext(TableContext);

  const handleMouseDown = event => {
    event.persist();
    const { size, coordinate } = properties(mode);
    const parentNode = event.target.parentElement;

    const curNode = parentNode;
    const curPadding = getNodePaddings(mode, curNode);
    const curStartSize = curNode[size]// - curPadding;

    let nextPadding, nextStartSize;
    if (mode === COLUMNS_MODE) {
      const nextNode = curNode.nextElementSibling;
      nextPadding = getNodePaddings(mode, nextNode);
      nextStartSize = nextNode[size]// - nextPadding;
    }

    setInteraction({
      mode,
      index,
      curNode,
      startCoordinate: event[coordinate],
      curStartSize,
      curPadding,
      nextStartSize,
      nextPadding
    });
  };

  const handleMouseMove = useCallback(event => {
    if (interaction && interaction.mode === mode) {
      setDimensions(state => {
        const { size, sizeWithPaddings } = calculateSizes(mode, interaction, state[mode].size, event)
        const offset = calculateOffset(mode, sizeWithPaddings);
        return {
          ...state,
          [mode]: {
            size,
            offset
          }
        }
      });
    }
  }, [mode, setDimensions, interaction]);

  const handleMouseUp = useCallback(() => {
    if (interaction) setInteraction(null);
  }, [interaction, setInteraction]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return <div {...props} onMouseDown={handleMouseDown} />;
};

export const TableColumnResizer = props => <TableResizer mode={COLUMNS_MODE} {...props} />;
export const TableRowResizer = props => <TableResizer mode={ROWS_MODE} {...props} />;