import React, { useMemo } from 'react';
import classNames from 'classnames';
import Cells, { defaultEditComponents } from './Cells';
import { useTable, useKeyboard, TableContext } from './';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import GridResizer from '../grid/GridResizer';

const Heading = ({ index, onColumnsChange, column, defaultColumnWidth, style }) => {
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
          onMouseMove={onColumnsChange} />
    </ScrollerCell>
  )
};

const Header = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.HeaderComponent || Heading;
    const fixedIntersection = index < props.fixColumns;
    const style = {
      position: 'sticky',
      top: 0,
      zIndex: fixedIntersection ? 4 : 3
    };
    return (
      <Component
          key={index}
          index={index}
          column={column}
          onColumnsChange={props.onColumnsChange}
          defaultColumnWidth={props.defaultColumnWidth}
          style={style} />
    )
  })
});

const FooterItem = ({ value, column, style }) => {
  const footerValue = column.footerValue && column.footerValue(value);
  return (
    <ScrollerCell
        className={classNames('footer', column.type || 'string')}
        column={column}
        style={style}>
      {footerValue}
    </ScrollerCell>
  )
};

const Footer = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.FooterComponent || FooterItem;
    const fixedIntersection = index < props.fixColumns;
    const style = {
      position: 'sticky',
      bottom: 0,
      zIndex: fixedIntersection ? 4 : 3
    };
    return (
      <Component
          key={index}
          value={props.value}
          column={column}
          style={style} />
    )
  })
});

/**
 * @type {import('react').FunctionComponent<import('./').TableProps>}
 */
const Table = inputProps => {
  let props = { defaultEditComponents, ...inputProps };
  const tableProps = useTable(props);
  props = { ...props, ...tableProps };
  const scrollerProps = useScroller(props);
  props = { ...props, ...scrollerProps };

  const onKeyDown = useKeyboard(props);

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
        defaultEditComponents={props.defaultEditComponents}
        readOnly={props.readOnly}
        editingCell={props.editingCell}
        onEditingCellChange={props.onEditingCellChange}
        selectedCells={props.selectedCells}
        onSelectedCellsChange={props.onSelectedCellsChange}
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
        value={props.value}
        onChange={props.onChange}
        columns={props.columns}
        totalRows={props.totalRows}
        totalColumns={props.totalColumns} />
  );
  const footerElement = props.showFooter ? (
    <Footer
        value={props.value}
        columns={props.columns}
        fixColumns={props.fixColumns} />
  ) : null;

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
              {headerElement}
              {cellsElement}
              {footerElement}
            </div>
          </div>
        </div>
      </ScrollerContainer>
    </TableContext.Provider>
  );
};

export default Table;