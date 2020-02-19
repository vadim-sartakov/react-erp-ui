import React, { useMemo } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { useTable, TableContext } from './';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import ResizeLines from '../grid/ResizeLines';
import GridResizer from '../grid/GridResizer';

const Heading = ({ index, columns, onColumnsChange, column, defaultColumnWidth, fixedIntersection }) => {
  const style = {
    position: 'sticky',
    top: 0,
    zIndex: fixedIntersection ? 4 : 3
  };
  return (
    <ScrollerCell
        className={classNames('header', column.type || 'string')}
        column={column}
        style={style}>
      {column.title}
      <GridResizer
          type="column"
          className="column-resizer"
          index={index}
          defaultSize={defaultColumnWidth}
          meta={column}
          onChange={onColumnsChange}
          onResize={onColumnsChange} />
    </ScrollerCell>
  )
};

const Header = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.HeaderComponent || Heading;
    const fixedIntersection = index < props.fixColumns;
    return (
      <Component
          key={index}
          index={index}
          columns={props.columns}
          column={column}
          onColumnsChange={props.onColumnsChange}
          defaultColumnWidth={props.defaultColumnWidth}
          fixedIntersection={fixedIntersection} />
    )
  })
});

const Cell = ({ column, value }) => {
  return (
    <ScrollerCell className={classNames('cell', column.type || 'string')} column={column}>
      {column.format ? column.format(value) : value}
    </ScrollerCell>
  )
};

const Cells = React.memo(({ visibleRows, visibleColumns, value, columns }) => {
  return visibleRows.reduce((acc, rowIndex) => {
    const rowValue = value[rowIndex];
    const columnsElements = visibleColumns.map(columnIndex => {
      const column = columns[columnIndex];
      const value = get(rowValue, column.valuePath);
      const Component = column.Component || Cell;
      return <Component key={`${rowIndex}-${columnIndex}`} column={column} value={value} />;
    });
    return [...acc, ...columnsElements];
  }, [])
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

  const headerElement = (
    <Header
        fixColumns={props.fixColumns}
        columns={props.columns}
        onColumnsChange={props.onColumnsChange}
        headerRows={props.headerRows}
        defaultColumnWidth={props.defaultColumnWidth} />
  );
  const cellsElement = (
    <Cells
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
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
            <div style={props.gridStyles}>
              {headerElement}
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