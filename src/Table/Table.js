import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTable, TableContext } from './';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import ResizeLines from '../grid/ResizeLines';
import MergedCell from '../grid/MergedCell';

const Header = ({ column }) => {
  return (
    <ScrollerCell className={classNames('header', column.type || 'string')} column={column}>
      {column.title}
    </ScrollerCell>
  )
};

const Headers = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.HeaderComponent || Header;
    return <Component key={index} index={index} column={column} />
  })
});

const Cells = React.memo(props => {
  return (
    <div></div>
  )
});

const Footer = React.memo(props => {
  return (
    <div></div>
  )
});

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

  const headersElement = (
    <Headers columns={props.columns} headerRows={props.headerRows} />
  );
  const cellsElement = (
    <Cells
        value={props.value}
        columns={props.columns} />
  );
  const footerElement = [];
  const resizeColumnElement = props.resizeInteraction && props.resizeInteraction.type === 'column' && (
    <ResizeLines
        index={props.resizeInteraction.index}
        visibleIndexes={props.visibleColumns}
        fixCount={props.fixColumns}
        type="column"
        defaultSize={props.defaultColumnWidth}
        meta={props.resizeColumns} />
  );

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
              {headersElement}
              {cellsElement}
              {footerElement}
            </div>
          </div>
          {resizeColumnElement}
        </div>
      </ScrollerContainer>
    </TableContext.Provider>
  );
};

export default Table;