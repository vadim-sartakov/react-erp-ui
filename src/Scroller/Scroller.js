import React from 'react';
import { useScroller, ScrollerContainer, ScrollerCell } from './';

/** @type {import('react').FunctionComponent<import('.').ScrollerProps>} */
const Scroller = inputProps => {
  const scrollerProps = useScroller(inputProps);

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
        return (
          <ScrollerCell key={`${rowIndex}-${columnIndex}`} {...cellProps}>
            <CellComponent {...cellProps} />
          </ScrollerCell>
        );
      });
      return [...acc, ...columnsElements];
    } else {
      const valueArray = loadedValues || value;
      const curValue = valueArray[rowIndex];
      const cellProps = { row, rowIndex, value: curValue };
      const rowElement = (
        <ScrollerCell key={rowIndex} {...cellProps}>
          <CellComponent {...cellProps} />
        </ScrollerCell>
      );
      return [...acc, rowElement];
    }
  }, []);

  return (
    <ScrollerContainer {...props}>
      {elements}
    </ScrollerContainer>
  )
};

export default Scroller;