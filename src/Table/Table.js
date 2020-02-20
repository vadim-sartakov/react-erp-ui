import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { useTable, TableContext } from './';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import ResizeLines from '../grid/ResizeLines';
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

const CellsRowContext = createContext();

const CellsRow = ({ children }) => {
  const [hoverRow, onHoverRowChange] = useState();
  return (
    <CellsRowContext.Provider value={{ hoverRow, onHoverRowChange }}>
      {children}
    </CellsRowContext.Provider>
  )
};

const Cell = ({ value, hover, selectedRow, selectedCell, column, ...props }) => {
  return (
    <ScrollerCell
        className={classNames(
          'cell',
          column.type || 'string',
          {
            'hover-row': hover,
            'selected-row': selectedRow,
            'selected-cell': selectedCell
          }
        )}
        column={column}
        {...props}>
      {column.format ? column.format(value) : value}
    </ScrollerCell>
  )
};

const CellWrapper = ({ value, columns, selectedCells, onSelectedCellsChange, rowIndex, columnIndex }) => {
  const { hoverRow, onHoverRowChange } = useContext(CellsRowContext);

  const onMouseEnter = useCallback(() => onHoverRowChange(true), [onHoverRowChange]);
  const onMouseLeave = useCallback(() => onHoverRowChange(false), [onHoverRowChange]);

  const handleSelect = useCallback(({ ctrlKey, shiftKey }) => {
    onSelectedCellsChange(selectedCells => {
      const lastSelection = selectedCells[selectedCells.length - 1];
      const curSelection = { row: rowIndex, column: columnIndex };

      let nextSelection;
      if (ctrlKey && lastSelection) {
        nextSelection = [...selectedCells, curSelection];
      } else if (shiftKey && lastSelection) {
        const startRowIndex = selectedCells.reduce((prev, selection) => Math.min(prev, selection.row, curSelection.row), value.length - 1);
        const endRowIndex = selectedCells.reduce((prev, selection) => Math.max(prev, selection.row, curSelection.row), 0);
        nextSelection = [];
        for (let i = startRowIndex; i <= endRowIndex; i++) {
          nextSelection.push({ row: i });
        }
      } else {
        nextSelection = [curSelection];
      }      
      return nextSelection;
    });
  }, [columnIndex, rowIndex, onSelectedCellsChange]);

  const column = columns[columnIndex];
  const rowValue = value[rowIndex];
  const curValue = get(rowValue, column.valuePath);
  const Component = column.Component || Cell;

  const selectedRow = selectedCells.some(selectedCell => selectedCell.row === rowIndex);
  const selectedCell = selectedCells.some(selectedCell => selectedCell.row === rowIndex && selectedCell.column === columnIndex);

  return (
    <Component
        hover={hoverRow}
        selectedRow={selectedRow}
        selectedCell={selectedCell}
        column={column}
        value={curValue}
        onClick={handleSelect}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave} />
  );
};

const Cells = React.memo(({ selectedCells, onSelectedCellsChange, visibleRows, visibleColumns, value, columns }) => {
  return visibleRows.map(rowIndex => {
    const columnsElements = (
      <CellsRow key={rowIndex}>
        {visibleColumns.map(columnIndex => {
          return (
            <CellWrapper
                key={`${rowIndex}-${columnIndex}`}
                value={value}
                columns={columns}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                selectedCells={selectedCells}
                onSelectedCellsChange={onSelectedCellsChange} />
          );
        })}
      </CellsRow>
    );
    return columnsElements;
  }, [])
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
        selectedCells={props.selectedCells}
        onSelectedCellsChange={props.onSelectedCellsChange}
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
        value={props.value}
        columns={props.columns} />
  );
  const footerElement = props.showFooter ? (
    <Footer
        value={props.value}
        columns={props.columns}
        fixColumns={props.fixColumns} />
  ) : null;
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