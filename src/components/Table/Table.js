import React, { useState, createContext, useContext, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TableContext = createContext();

export const Table = ({
  defaultRowHeight,
  defaultColumnWidth,
  fixRows,
  fixColumns,
  classes,
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
      classes,
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
  fixColumns: PropTypes.number,
  classes: PropTypes.shape({
    fixRow: PropTypes.string,
    fixColumn: PropTypes.string,
    lastFixColumn: PropTypes.string,
    lastFixRow: PropTypes.string
  })
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

const getFixedClassName = ({ index, fixCells, className, fixClass, lastFixClass }) => {
  const cellIsFixed = isFixed(index, fixCells);
  return classNames(
    { 
      [fixClass]: cellIsFixed,
      [lastFixClass]: lastFixClass && cellIsFixed && index === fixCells - 1,
    },
    className
  )
};

export const TableHeaderCell = ({ className, style = {}, columnIndex, rowIndex, ...props }) => {
  const { defaultColumnWidth, defaultRowHeight, widths: [widths], heights: [heights], fixColumns, fixRows, classes } = useContext(TableContext);

  const columnFixedStyle = getFixedStyle({
    index: columnIndex,
    fixCells: fixColumns,
    sizes: widths,
    defaultSize: defaultColumnWidth,
    offsetProperty: 'left',
  });

  const rowFixedStyle = getFixedStyle({
    index: rowIndex,
    fixCells: fixRows,
    sizes: heights,
    defaultSize: defaultRowHeight,
    offsetProperty: 'top',
  });

  const width = widths[columnIndex] || defaultColumnWidth;
  const nextStyle = { ...style, width, ...columnFixedStyle, ...rowFixedStyle };
  
  const columnClassName = getFixedClassName({ className, index: columnIndex, fixClass: classes.fixColumn, lastFixClass: classes.lastFixColumn, fixCells: fixColumns });
  const rowClassName = getFixedClassName({ className, index: rowIndex, fixClass: classes.fixRow, lastFixClass: classes.lastFixRow, fixCells: fixRows });

  return <th {...props} className={classNames(columnClassName, rowClassName)} style={nextStyle} />;
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

export const TableCell = ({ columnIndex, rowIndex, className, style, ...props }) => {
  const { defaultColumnWidth, widths: [widths], fixColumns, fixRows, classes } = useContext(TableContext);

  const columnFixedStyle = getFixedStyle({
    index: columnIndex,
    fixCells: fixColumns,
    sizes: widths,
    defaultSize: defaultColumnWidth,
    offsetProperty: 'left',
  });

  const columnClassName = getFixedClassName({ className, index: columnIndex, fixClass: classes.fixColumn, lastFixClass: classes.lastFixColumn, fixCells: fixColumns });
  const rowClassName = getFixedClassName({ className, index: rowIndex, fixClass: classes.fixRow, lastFixClass: classes.lastFixRow, fixCells: fixRows });

  const nextStyle = { ...style, ...columnFixedStyle };
  return <td {...props} className={classNames(columnClassName/*, rowClassName*/)} style={nextStyle} />;
};
TableCell.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

export const TableCellValue = ({ mode, style, ...props }) => {
  const { defaultRowHeight, heights: [heights] } = useContext(TableContext);
  const index = useContext(TableRowContext);
  const height = heights[index] || defaultRowHeight;
  const nextStyle = { ...style, height, overflow: 'hidden' };
  return <div style={nextStyle} {...props} />;
};

export const TableBody = props => <tbody {...props} />;