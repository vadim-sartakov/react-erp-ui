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

  const { CellComponent } = props;

  const elements = props.visibleRows.reduce((acc, rowIndex) => {
    const row = props.rows && props.rows[rowIndex];
    if (props.visibleColumns) {
      const columnsElements = props.visibleColumns.map(columnIndex => {
        const column = props.columns && props.columns[columnIndex];
        const valueArray = props.loadedValues || props.value;
        const curValue = valueArray[rowIndex] && valueArray[rowIndex][columnIndex];
        const cellProps = { row, column, rowIndex, columnIndex, value: curValue };
        return <CellComponent key={`${rowIndex}-${columnIndex}`} {...cellProps} />;
      });
      return [...acc, ...columnsElements];
    } else {
      const valueArray = props.loadedValues || props.value;
      const curValue = valueArray[rowIndex];
      const cellProps = { row, rowIndex, value: curValue };
      const rowElement = <CellComponent key={rowIndex} {...cellProps} />;
      return [...acc, rowElement];
    }
  }, []);

  return (
    <ScrollerContainer
        ref={scrollerContainerRef}
        defaultRowHeight={props.defaultRowHeight}
        defaultColumnWidth={props.defaultColumnWidth}
        onScroll={props.onScroll}
        width={props.width}
        height={props.height}>
      <div style={props.coverStyles}>
        <div style={props.pagesStyles}>
          <div style={props.gridStyles}>
            {elements}
          </div>
        </div>
      </div>
    </ScrollerContainer>
  )
};

export default Scroller;