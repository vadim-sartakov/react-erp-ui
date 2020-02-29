import React from 'react';
import { useScroller, ScrollerContainer } from './';

const Scroller = inputProps => {

  const scrollerProps = useScroller(inputProps);

  const props = {
    ...inputProps,
    ...scrollerProps
  };

  const {
    scrollerContainerRef,
    onScroll,
    width,
    height,
    coverStyles,
    pagesStyles,
    visibleRowsIndexes,
    visibleColumnsIndexes,
    rowsSizes = [],
    columnsSizes = [],
    defaultColumnWidth,
    defaultRowHeight,
    value,
    CellComponent,
    RowComponent = 'div'
  } = props;

  const elements = visibleRowsIndexes.map(rowIndex => {
    const height = rowsSizes[rowIndex] || defaultRowHeight;
    if (visibleColumnsIndexes) {
      const columnsElements = visibleColumnsIndexes.map(columnIndex => {
        const width = columnsSizes[columnIndex] || defaultColumnWidth;
        const curValue = value[rowIndex] && value[rowIndex][columnIndex];
        const style = { width, height };
        return <CellComponent key={`${rowIndex}-${columnIndex}`} value={curValue} style={style} />;
      });
      return (
        <RowComponent key={rowIndex} style={{ display: 'flex' }}>
          {columnsElements}
        </RowComponent>
      );
    } else {
      const curValue = value[rowIndex];
      const style = { height };
      const rowElement = <CellComponent key={rowIndex} value={curValue} style={style} />;
      return rowElement;
    }
  });

  return (
    <ScrollerContainer
        ref={scrollerContainerRef}
        defaultRowHeight={defaultRowHeight}
        defaultColumnWidth={defaultColumnWidth}
        onScroll={onScroll}
        width={width}
        height={height}>
      <div style={coverStyles}>
        <div style={pagesStyles}>
          {elements}
        </div>
      </div>
    </ScrollerContainer>
  )
};

export default Scroller;