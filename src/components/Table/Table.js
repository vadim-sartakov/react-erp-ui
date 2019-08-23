import React, { useState, createContext, useContext, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TableContext = createContext();

export const Table = ({
  defaultRowHeight,
  defaultColumnWidth,
  fixRows,
  fixColumns,
  fixCellClass,
  style = {},
  ...props
}) => {
  const [widths, setWidths] = useState([]);
  const [heights, setHeights] = useState([]);
  return (
    <TableContext.Provider value={{
      defaultRowHeight,
      defaultColumnWidth,
      fixRows,
      fixColumns,
      fixCellClass,
      widths: [widths, setWidths],
      heights: [heights, setHeights]
    }}>
      <table {...props} style={{ ...style, tableLayout: 'fixed', width: 'min-content' }} />
    </TableContext.Provider>
  )
};
Table.propTypes = {
  defaultRowHeight: PropTypes.number.isRequired,
  defaultColumnWidth: PropTypes.number.isRequired,
  fixRows: PropTypes.number,
  fixColumns: PropTypes.number
};
Table.defaultProps = {
  defaultRowHeight: 16,
  defaultColumnWidth: 100,
  fixRows: 0,
  fixColumns: 0
};

export const TableHeader = props => <thead {...props} />;

const isFixed = (index, fixCells) => index <= fixCells - 1;

const getFixedStyle = ({ index, fixCells, sizes, defaultSize, offsetProperty }) => {
  const style = {};
  if (isFixed(index, fixCells)) {
    style.position = 'sticky';
    let offset = 0;
    for(let i = 0; i < index && i < fixCells; i++) {
      const currentSize = sizes[i] || defaultSize;
      offset = offset + currentSize;
    }
    style[offsetProperty] = offset;
  }
  return style;
};

export const TableHeaderCell = ({ className, style = {}, index, ...props }) => {
  const { fixCellClass, defaultColumnWidth, widths: [widths], fixColumns } = useContext(TableContext);
  const width = widths[index] || defaultColumnWidth;
  const fixedStyle = getFixedStyle({
    index,
    fixCells: fixColumns,
    sizes: widths,
    defaultSize: defaultColumnWidth,
    offsetProperty: 'left'
  });
  const nextStyle = { ...style, width, ...fixedStyle };
  return (
    <th
        {...props}
        className={classNames(
          { [fixCellClass]: isFixed(index, fixColumns) },
          className
        )}
        style={nextStyle} />
  );
};

const useResize = (index, { defaultSize, size, coordinate }) => {
  const { [defaultSize]: defSize, [size]: [sizes, setSizes] } = useContext(TableContext);
  const [interaction, setInteraction] = useState();

  const handleMouseDown = event => {
    const startCoordinate = event[coordinate];
    const startSize = sizes[index] || defSize;
    setInteraction({
      index,
      startCoordinate,
      startSize
    });
  };

  useEffect(() => {
    const handleMouseMove = event => {
      if (interaction) {
        setSizes(sizes => {
          const nextSizes = [...sizes];
          const diff = event[coordinate] - interaction.startCoordinate;
          nextSizes[index] = interaction.startSize + diff;
          return nextSizes;
        });
      }
    };

    const handleMouseUp = () => {
      if (interaction) setInteraction(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [index, coordinate, interaction, setSizes]);

  return handleMouseDown;

};

export const TableColumnResizer = ({ index, ...props }) => {
  const handleMouseDown = useResize(index, {
    defaultSize: 'defaultColumnWidth',
    size: 'widths',
    coordinate: 'pageX'
  })
  return <div {...props} onMouseDown={handleMouseDown} />;
};

const TableRowContext = createContext();

export const TableRow = ({ index, ...props }) => (
  <TableRowContext.Provider value={index}>
    <tr {...props} />
  </TableRowContext.Provider>
);
TableRow.propTypes = {
  index: PropTypes.number.isRequired
};

export const TableRowResizer = props => {
  const index = useContext(TableRowContext);
  const handleMouseDown = useResize(index, {
    defaultSize: 'defaultRowHeight',
    size: 'heights',
    coordinate: 'pageY'
  })
  return <div {...props} onMouseDown={handleMouseDown} />;
};

export const TableCell = props => <td {...props} />;

export const TableCellValue = ({ mode, style, ...props }) => {
  const { defaultRowHeight, heights: [heights] } = useContext(TableContext);
  const index = useContext(TableRowContext);
  const height = heights[index] || defaultRowHeight;
  const nextStyle = { ...style, height, overflow: 'hidden' };
  return <div style={nextStyle} {...props} />;
};

export const TableBody = props => <tbody {...props} />;