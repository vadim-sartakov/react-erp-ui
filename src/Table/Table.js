import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTable, TableContext } from './';
import { useScroller, ScrollerContainer } from '../Scroller';

/**
 * @type {import('react').FunctionComponent<import('./').TableProps>}
 */
const Table = inputProps => {
  let props = inputProps;
  const tableProps = useTable(props);
  props = { ...props, ...tableProps };
  const scrollerProps = useScroller(props);
  props = { ...props, ...scrollerProps };

  const onKeyDown = () => {};

  const contextValue = useMemo(() => ({
    defaultColumnWidth: props.defaultColumnWidth,
    defaultRowHeight: props.defaultRowHeight,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns
  }), [
    props.defaultColumnWidth,
    props.defaultRowHeight,
    props.fixRows,
    props.fixColumns
  ]);

  const cellsElement = [];
  const mergedCellsElements = [];
  const resizeColumnElement = [];

  return (
    <TableContext.Provider value={contextValue}>
      <ScrollerContainer
          ref={props.scrollerContainerRef}
          className={classNames('table', props.className)}
          onKeyDown={onKeyDown}
          defaultRowHeight={props.defaultRowHeight}
          defaultColumnWidth={props.defaultColumnWidth}
          onScroll={props.onScroll}
          width={props.width}
          height={props.height}>
        <div ref={props.scrollerCoverRef}
            style={props.coverStyles}>
          <div style={props.pagesStyles}>
            <div style={{ ...props.gridStyles, userSelect: 'none' }}>
              {cellsElement}
            </div>
          </div>
          {mergedCellsElements}
          {resizeColumnElement}
        </div>
      </ScrollerContainer>
    </TableContext.Provider>
  );
};

export default Table;