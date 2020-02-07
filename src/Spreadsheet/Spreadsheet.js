import React from 'react';
import { useScroller, ScrollerContainer } from '../Scroller';
import { SpreadsheetContainer, SpreadsheetCell, useSpreadsheet, useKeyboard, useMouse } from './';
import GroupLevelButton from './GroupLevelButton';
import { Heading, HeadingsIntersection } from './Heading';
import { GroupLine } from './GroupLine';
import ResizeLines from './ResizeLines';
import FixLines from './FixLines';
import SpecialCellEmptyArea from './SpecialCellEmptyArea';
import SelectedRange from './SelectedRange';
import Cell from './Cell';

export const visibleRangesFilter = ({
  fixRows,
  fixColumns,
  visibleRows,
  visibleColumns
}) => mergedRange => {
  return mergedRange.start.row < visibleRows[fixRows] || mergedRange.start.column < visibleColumns[fixColumns] ||
      (mergedRange.start.row <= visibleRows[visibleRows.length - 1] &&
          mergedRange.start.column <= visibleColumns[visibleColumns.length - 1] &&
          mergedRange.end.row >= visibleRows[fixRows] &&
          mergedRange.end.column >= visibleColumns[fixColumns]);
};

const Cells = React.memo(({
  HeadingComponent,
  HeadingsIntersectionComponent = HeadingsIntersection,
  GroupLevelButtonComponent = GroupLevelButton,
  SpecialCellEmptyAreaComponent = SpecialCellEmptyArea,
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
                return <SpecialCellEmptyAreaComponent key={key} row={row} column={column} />;
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
                      mergedCells={props.mergedCells}
                      fixRows={props.fixRows}
                      fixColumns={props.fixColumns}
                      row={row}
                      column={column}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      cell={curCell}
                      Component={CellComponent}
                      onSelectedCellsChange={props.onSelectedCellsChange} />
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

  const spreadsheetProps = useSpreadsheet(inputProps);
  props = {
    ...inputProps,
    ...spreadsheetProps
  };
  const onKeyDown = useKeyboard(props);
  const onMouseDown = useMouse(props);
  const { gridStyles, ...scrollerProps } = useScroller(props);

  props = {
    ...inputProps,
    ...spreadsheetProps,
    ...scrollerProps
  };

  const scrollerTop = scrollerProps.pagesStyles.top;
  const scrollerLeft = scrollerProps.pagesStyles.left;

  const cellsElement = (
    <Cells
        key="cells"
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
        key="merged-cells"
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
        // TODO: get rid of this
        scrollerTop={scrollerTop}
        scrollerLeft={scrollerLeft}
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
        key="selected-ranges"
        SelectedRangeComponent={props.SelectedRangeComponent}
        selectedCells={props.selectedCells}
        rowsPage={props.rowsPage}
        columnsPage={props.columnsPage}
        rows={props.rows}
        columns={props.columns}
        fixRows={props.fixRows}
        fixColumns={props.fixColumns}
        // TODO: get rid of this
        scrollerTop={scrollerTop}
        scrollerLeft={scrollerLeft}
        defaultRowHeight={props.defaultRowHeight}
        defaultColumnWidth={props.defaultColumnWidth} />
  );

  const fixedAreasElement = (
    <FixLines
        key="fixed-area"
        Component={props.FixLinesComponent}
        rows={props.rows}
        columns={props.columns}
        specialRowsCount={props.specialRowsCount}
        specialColumnsCount={props.specialColumnsCount} />
  );
  const resizeRowElement = props.resizeInteraction && props.resizeInteraction.type === 'row' && (
    <ResizeLines
        key="resize-row"
        scroll={scrollerTop}
        index={props.resizeInteraction.index}
        visibleIndexes={props.visibleRows}
        fixCount={props.fixRows}
        type="row"
        defaultSize={props.defaultRowHeight}
        meta={props.resizeRows} />
  );
  const resizeColumnElement = props.resizeInteraction && props.resizeInteraction.type === 'column' && (
    <ResizeLines
        key="resize-column"
        scroll={scrollerLeft}
        index={props.resizeInteraction.index}
        visibleIndexes={props.visibleColumns}
        fixCount={props.fixColumns}
        type="column"
        defaultSize={props.defaultColumnWidth}
        meta={props.resizeColumns} />
  );

  const elements = [
    cellsElement,
    mergedCellsElements,
    visibleSelectionElements,
    fixedAreasElement,
    resizeRowElement,
    resizeColumnElement
  ];

  return (
    <ScrollerContainer
          ref={props.scrollerContainerRef}
          coverRef={props.scrollerCoverRef}
          onKeyDown={onKeyDown}
          {...props}
          {...scrollerProps}>
      <SpreadsheetContainer
          ref={props.scrollerContainerRef}
          onMouseDown={onMouseDown}
          {...props}
          {...spreadsheetProps}
          style={gridStyles}>
        {elements}
      </SpreadsheetContainer>
    </ScrollerContainer>
  );
};

export default Spreadsheet;