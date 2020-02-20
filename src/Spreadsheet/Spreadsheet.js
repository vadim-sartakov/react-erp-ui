import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useScroller, ScrollerContainer } from '../Scroller';
import { SpreadsheetContext, SpreadsheetCell, useSpreadsheet, useKeyboard, useMouse } from './';
import GroupLevelButton from './GroupLevelButton';
import { Heading, HeadingsIntersection } from './Heading';
import { GroupLine } from './GroupLine';
import SelectedRange from './SelectedRange';
import Cell from './Cell';
import ResizeLines from '../grid/ResizeLines';
import FixLines from '../grid/FixLines';
import { visibleRangesFilter } from '../grid/utils';

const SpecialCellEmptyArea = props => <SpreadsheetCell className="special-cell-empty-area" {...props} />;

const Cells = React.memo(({
  HeadingComponent,
  HeadingsIntersectionComponent = HeadingsIntersection,
  GroupLevelButtonComponent = GroupLevelButton,
  CellComponent,
  ...props
}) => {
  return props.visibleRows.reduce((acc, rowIndex, seqRowIndex) => {
    const row = props.rows[rowIndex] || {};
    const rowType = row.type;

    const columnsElements = props.visibleColumns.map((columnIndex, seqColumnIndex) => {
      const column = props.columns[columnIndex] || {};
      const columnsType = column.type;
      const key=`${seqRowIndex}_${seqColumnIndex}`;

      const isMerged = !rowType && !columnsType ? props.mergedCells.some(mergedRange =>
          rowIndex >= mergedRange.start.row &&
          columnIndex >= mergedRange.start.column &&
          rowIndex <= mergedRange.end.row &&
          columnIndex <= mergedRange.end.column) : false;

      if (isMerged) {
        return (
          <SpreadsheetCell
              key={key}
              row={row}
              column={column} />
        )        
      } else {
        switch(rowType) {
          case 'GROUP':

            switch(columnsType) {
              case 'NUMBER':
                return <GroupLevelButtonComponent key={key} index={rowIndex} row={row} column={column} onClick={props.onColumnGroupLevelButtonClick(rowIndex + 1)} />;
              default:
                return <SpecialCellEmptyArea key={key} row={row} column={column} />;
            }
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                return <GroupLevelButtonComponent key={key} row={row} column={column} index={columnIndex} onClick={props.onRowGroupLevelButtonClick(columnIndex + 1)} style={{ zIndex: 8 }} />;
              case 'NUMBER':
                return <HeadingsIntersectionComponent key={key} row={row} column={column} />;
              default:
                return (
                  <Heading
                      key={key}
                      Component={HeadingComponent}
                      selectedCells={props.selectedCells}
                      row={row}
                      column={column}
                      type="column"
                      meta={column}
                      onResizeInteractionChange={props.onResizeInteractionChange}
                      defaultSize={props.defaultColumnWidth}
                      index={columnIndex}
                      onChange={props.onColumnsChange}
                      onResize={props.onResizeColumns} />
                );
            }
          default:
            const rowCells = props.cells[rowIndex - props.specialRowsCount];
            const curCell = rowCells && rowCells[columnIndex - props.specialColumnsCount];
            
            switch(columnsType) {
              case 'GROUP':
                return <SpecialCellEmptyArea key={key} row={row} column={column} />;
              case 'NUMBER':
                return (
                  <Heading
                      key={key}
                      Component={HeadingComponent}
                      selectedCells={props.selectedCells}
                      row={row}
                      column={column}
                      type="row"
                      meta={row}
                      index={rowIndex}
                      onResizeInteractionChange={props.onResizeInteractionChange}
                      defaultSize={props.defaultRowHeight}
                      onChange={props.onRowsChange}
                      onResize={props.onResizeRows} />
                );
              default:
                return (
                  <Cell
                      key={key}
                      fixRows={props.fixRows}
                      fixColumns={props.fixColumns}
                      row={row}
                      column={column}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      cell={curCell}
                      Component={CellComponent} />
                );
            }
        }
      }

    });

    return [...acc, ...columnsElements];   
  }, []);
});

const MergedCells = React.memo(({
  GroupLineComponent,
  CellComponent,
  ...props
}) => {
  const visibleMerges = props.mergedCells.filter(visibleRangesFilter({ fixRows: props.fixRows, fixColumns: props.fixColumns, visibleRows: props.visibleRows, visibleColumns: props.visibleColumns }));

  return visibleMerges.map(mergedRange => {
    const columnIndex = mergedRange.start.column;
    const rowIndex = mergedRange.start.row;

    const row = props.rows[rowIndex] || {};
    const column = props.columns[columnIndex] || {};
    const rowCells = props.cells[rowIndex - props.specialRowsCount];
    const curCell = rowCells && rowCells[columnIndex - props.specialColumnsCount];

    const mergedCellProps = {
      key: `merged-cell-${rowIndex}-${columnIndex}`,
      mergedRange,
      rows: props.rows,
      columns: props.columns,
      fixRows: props.fixRows,
      fixColumns: props.fixColumns,
      rowIndex,
      columnIndex,
      scrollerTop: props.scrollerTop,
      scrollerLeft: props.scrollerLeft,
      defaultRowHeight: props.defaultRowHeight,
      defaultColumnWidth: props.defaultColumnWidth
    };

    if (row.type === 'GROUP' || column.type === 'GROUP') {
      return (
        <GroupLine
            {...mergedCellProps}
            type={row.type === 'GROUP' ? 'column' : 'row'}
            rows={props.rows}
            columns={props.columns}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            rowsGroups={props.rowsGroups}
            columnsGroups={props.columnsGroups}
            onRowGroupButtonClick={props.onRowGroupButtonClick}
            onColumnGroupButtonClick={props.onColumnGroupButtonClick}
            Component={GroupLineComponent} />
      )
    } else {
      return (
        <Cell
            {...mergedCellProps}
            Component={CellComponent}
            mergedCells={props.mergedCells}
            row={row}
            column={column}
            cell={curCell}
            onSelectedCellsChange={props.onSelectedCellsChange} />
      )
    }
  });
});

const SelectedRanges = React.memo(({
  SelectedRangeComponent = SelectedRange,
  ...props
}) => {
  const visibleSelections = props.selectedCells.filter(visibleRangesFilter);
  return visibleSelections.map((selectedRange, seqIndex) => {   
    const mergedRange = selectedRange;
    return (
      <SelectedRangeComponent
          key={`selected-cell-${props.rowsPage}-${props.columnsPage}-${seqIndex}`}
          mergedRange={mergedRange}
          rows={props.rows}
          columns={props.columns}
          fixRows={props.fixRows}
          fixColumns={props.fixColumns}
          scrollerTop={props.scrollerTop}
          scrollerLeft={props.scrollerLeft}
          defaultRowHeight={props.defaultRowHeight}
          defaultColumnWidth={props.defaultColumnWidth}
          multiple={visibleSelections.length > 1} />
    );
  });
});

/** @type {import('react').FunctionComponent<import('./').SpreadsheetProps>} */
const Spreadsheet = inputProps => {
  let props;

  const printProps = inputProps.printMode ? {
    width: 'auto',
    height: 'auto',
    rowsPerPage: inputProps.totalRows,
    columnsPerPage: inputProps.totalColumns,
    hideHeadings: true,
    hideGrid: true,
    fixRows: 0,
    fixColumns: 0
  } : undefined;

  props = {
    ...inputProps,
    ...printProps
  };

  const spreadsheetProps = useSpreadsheet(props);
  props = {
    ...inputProps,
    ...printProps,
    ...spreadsheetProps
  };
  const onKeyDown = useKeyboard(props);
  const onMouseDown = useMouse(props);

  const scrollerProps = useScroller(props);

  props = {
    ...inputProps,
    ...printProps,
    ...spreadsheetProps,
    ...scrollerProps
  };

  const cellsElement = (
    <Cells
        HeadingComponent={props.HeadingComponent}
        HeadingsIntersectionComponent={props.HeadingsIntersectionComponent}
        GroupLevelButtonComponent={props.GroupLevelButtonComponent}
        SpecialCellEmptyAreaComponent={props.SpecialCellEmptyAreaComponent}
        CellComponent={props.CellComponent}
        selectedCells={props.selectedCells}
        onSelectedCellsChange={props.onSelectedCellsChange}
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
        cells={props.cells}
        rows={props.rows}
        columns={props.columns}
        onRowsChange={props.onRowsChange}
        onColumnsChange={props.onColumnsChange}
        mergedCells={props.mergedCells}
        defaultRowHeight={props.defaultRowHeight}
        defaultColumnWidth={props.defaultColumnWidth}
        fixRows={props.fixRows}
        fixColumns={props.fixColumns}
        specialRowsCount={props.specialRowsCount}
        specialColumnsCount={props.specialColumnsCount}
        onRowGroupLevelButtonClick={props.onRowGroupLevelButtonClick}
        onColumnGroupLevelButtonClick={props.onColumnGroupLevelButtonClick}
        onResizeInteractionChange={props.onResizeInteractionChange}
        onResizeRows={props.onResizeRows}
        onResizeColumns={props.onResizeColumns} />
  );

  const mergedCellsElements = (
    <MergedCells
        mergedCells={props.mergedCells}
        GroupLineComponent={props.GroupLineComponent}
        CellComponent={props.CellComponent}
        fixRows={props.fixRows}
        fixColumns={props.fixColumns}
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
        rows={props.rows}
        columns={props.columns}
        cells={props.cells}
        specialRowsCount={props.specialRowsCount}
        specialColumnsCount={props.specialColumnsCount}
        defaultRowHeight={props.defaultRowHeight}
        defaultColumnWidth={props.defaultColumnWidth}
        rowsGroups={props.rowsGroups}
        columnsGroups={props.columnsGroups}
        onRowGroupButtonClick={props.onRowGroupButtonClick}
        onColumnGroupButtonClick={props.onColumnGroupButtonClick}
        onSelectedCellsChange={props.onSelectedCellsChange} />
  );

  const visibleSelectionElements = (
    <SelectedRanges
        SelectedRangeComponent={props.SelectedRangeComponent}
        selectedCells={props.selectedCells}
        rowsPage={props.rowsPage}
        columnsPage={props.columnsPage}
        rows={props.rows}
        columns={props.columns}
        fixRows={props.fixRows}
        fixColumns={props.fixColumns}
        defaultRowHeight={props.defaultRowHeight}
        defaultColumnWidth={props.defaultColumnWidth} />
  );

  const fixedAreasElement = (
    <FixLines
        rows={props.rows}
        columns={props.columns}
        specialRowsCount={props.specialRowsCount}
        specialColumnsCount={props.specialColumnsCount} />
  );
  const resizeRowElement = props.resizeInteraction && props.resizeInteraction.type === 'row' && (
    <ResizeLines
        index={props.resizeInteraction.index}
        visibleIndexes={props.visibleRows}
        fixCount={props.fixRows}
        type="row"
        defaultSize={props.defaultRowHeight}
        meta={props.resizeRows} />
  );
  const resizeColumnElement = props.resizeInteraction && props.resizeInteraction.type === 'column' && (
    <ResizeLines
        index={props.resizeInteraction.index}
        visibleIndexes={props.visibleColumns}
        fixCount={props.fixColumns}
        type="column"
        defaultSize={props.defaultColumnWidth}
        meta={props.resizeColumns} />
  );

  const contextValue = useMemo(() => ({
    defaultColumnWidth: props.defaultColumnWidth,
    defaultRowHeight: props.defaultRowHeight,
    groupSize: props.groupSize,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns,
    cellBorderColor: props.cellBorderColor || '#dee2e6',
    hideGrid: props.hideGrid
  }), [
    props.defaultColumnWidth,
    props.defaultRowHeight,
    props.groupSize,
    props.fixRows,
    props.fixColumns,
    props.cellBorderColor,
    props.hideGrid
  ]);

  return (
    <SpreadsheetContext.Provider value={contextValue}>
      <ScrollerContainer
          ref={props.scrollerContainerRef}
          className={classNames('spreadsheet', props.className)}
          onKeyDown={onKeyDown}
          defaultRowHeight={props.defaultRowHeight}
          defaultColumnWidth={props.defaultColumnWidth}
          onScroll={props.onScroll}
          width={props.width}
          height={props.height}
          //'hidden' value will prevent scroll appearing on print mode
          style={{ overflow: props.printMode ? 'hidden' : 'auto' }}>
        {/** 
         * Placed mouse handler here because scroller would trigger selection on scroll bar click,
         * while on spreadsheet level it would skip merged cells clicks
         */}
        <div ref={props.scrollerCoverRef}
            style={props.coverStyles}
            onMouseDown={onMouseDown}>
          {/** Static positioning on print mode will prevent incorrect page breaks */}
          <div style={{ ...props.pagesStyles, position: props.printMode ? 'static' : 'absolute' }}>
            <div style={{ ...props.gridStyles, userSelect: 'none' }}>
              {cellsElement}
            </div>
          </div>
          {mergedCellsElements}
          {visibleSelectionElements}
          {resizeRowElement}
          {resizeColumnElement}
          {fixedAreasElement}
        </div>
      </ScrollerContainer>
    </SpreadsheetContext.Provider>
  );
};

export default Spreadsheet;