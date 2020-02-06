import React, { useRef } from 'react';
import { useScroller, ScrollerContainer } from './';

/** @type {import('react').FunctionComponent<import('.').ScrollerProps>} */
const Scroller = inputProps => {
  const scrollerContainerRef = useRef();

  const scrollerProps = useScroller({ ...inputProps, scrollerContainerRef });

  const props = {
    ...inputProps,
    ...scrollerProps
  };

  const {
    visibleRows,
    visibleColumns,
    rows,
    columns,
    value,
    loadedValues,
    CellComponent
  } = props;

  const elements = visibleRows.reduce((acc, rowIndex) => {
    const row = rows && rows[rowIndex];
    if (visibleColumns) {
      const columnsElements = visibleColumns.map(columnIndex => {
        const column = columns && columns[columnIndex];
        const valueArray = loadedValues || value;
        const curValue = valueArray[rowIndex] && valueArray[rowIndex][columnIndex];
        const cellProps = { row, column, rowIndex, columnIndex, value: curValue };
        return <CellComponent key={`${rowIndex}-${columnIndex}`} {...cellProps} />;
      });
      return [...acc, ...columnsElements];
    } else {
      const valueArray = loadedValues || value;
      const curValue = valueArray[rowIndex];
      const cellProps = { row, rowIndex, value: curValue };
      const rowElement = <CellComponent key={rowIndex} {...cellProps} />;
      return [...acc, rowElement];
    }
  }, []);

  return (
    <ScrollerContainer {...props} ref={scrollerContainerRef}>
      {elements}
    </ScrollerContainer>
  )
};

export default Scroller;