import React from 'react';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import { SpreadsheetContainer, useSpreadsheet, useKeyboard, useMouse } from './';
import GroupLevelButton from './GroupLevelButton';
import { Heading, HeadingsIntersection } from './Heading';
import { GroupLine } from './GroupLine';
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

  const {
    rowsPage,
    columnsPage,
    cells,
    onSelectedCellsChange,
    selectedCells,
    visibleRows,
    visibleColumns,
    defaultRowHeight,
    defaultColumnWidth,
    fixRows,
    fixColumns,
    rows,
    columns,
    onRowsChange,
    onColumnsChange,
    SpecialCellEmptyAreaComponent = SpecialCellEmptyArea,
    HeadingComponent,
    HeadingsIntersectionComponent = HeadingsIntersection,
    GroupLevelButtonComponent = GroupLevelButton,
    GroupLineComponent,
    FixLinesComponent,
    SelectedRangeComponent = SelectedRange,
    CellComponent,
    mergedCells,
    specialRowsCount,
    specialColumnsCount,
    rowsGroups,
    columnsGroups,
    onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick,
    onRowGroupButtonClick,
    onColumnGroupButtonClick
  } = props;

  const cellsElements = visibleRows.reduce((acc, rowIndex, seqRowIndex) => {
    const row = rows[rowIndex] || {};
    const rowType = row.type;

    const columnsElements = visibleColumns.map((columnIndex, seqColumnIndex) => {
      const column = columns[columnIndex] || {};
      const columnsType = column.type;
      const key=`${seqRowIndex}_${seqColumnIndex}`;

      const isMerged = !rowType && !columnsType ? mergedCells.some(mergedRange =>
          rowIndex >= mergedRange.start.row &&
          columnIndex >= mergedRange.start.column &&
          rowIndex <= mergedRange.end.row &&
          columnIndex <= mergedRange.end.column) : false;

      if (isMerged) {
        return (
          <ScrollerCell
              key={key}
              row={row}
              column={column} />
        )        
      } else {
        switch(rowType) {
          case 'GROUP':

            switch(columnsType) {
              case 'NUMBER':
                return <GroupLevelButtonComponent key={key} index={rowIndex} row={row} column={column} onClick={onColumnGroupLevelButtonClick(rowIndex + 1)} />;
              default:
                return <SpecialCellEmptyAreaComponent key={key} row={row} column={column} />;
            }
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                return <GroupLevelButtonComponent key={key} row={row} column={column} index={columnIndex} onClick={onRowGroupLevelButtonClick(columnIndex + 1)} style={{ zIndex: 8 }} />;
              case 'NUMBER':
                return <HeadingsIntersectionComponent key={key} row={row} column={column} />;
              default:
                return (
                  <Heading
                      key={key}
                      Component={HeadingComponent}
                      selectedCells={selectedCells}
                      row={row}
                      column={column}
                      type="column"
                      meta={column}
                      defaultSize={defaultColumnWidth}
                      index={columnIndex}
                      onChange={onColumnsChange} />
                );
            }
          default:
            const rowCells = cells[rowIndex];
            const curCell = rowCells && rowCells[columnIndex];
            
            switch(columnsType) {
              case 'GROUP':
                return <SpecialCellEmptyArea key={key} row={row} column={column} />;
              case 'NUMBER':
                return (
                  <Heading
                      key={key}
                      Component={HeadingComponent}
                      selectedCells={selectedCells}
                      row={row}
                      column={column}
                      type="row"
                      meta={row}
                      index={rowIndex}
                      defaultSize={defaultRowHeight}
                      onChange={onRowsChange} />
                );
              default:
                return (
                  <Cell
                      key={key}
                      mergedCells={mergedCells}
                      fixRows={fixRows}
                      fixColumns={fixColumns}
                      row={row}
                      column={column}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      cell={curCell}
                      Component={CellComponent}
                      onSelectedCellsChange={onSelectedCellsChange} />
                );
            }
        }
      }

    });

    return [...acc, ...columnsElements];   
  }, []);

  const visibleMerges = mergedCells.filter(visibleRangesFilter({ fixRows, fixColumns, visibleRows, visibleColumns }));

  const mergedCellsElements = visibleMerges.map(mergedRange => {
    const columnIndex = mergedRange.start.column;
    const rowIndex = mergedRange.start.row;

    const row = rows[rowIndex] || {};
    const column = columns[columnIndex] || {};
    const rowCells = cells[rowIndex];
    const curCell = rowCells && rowCells[columnIndex];

    const mergedCellProps = {
      key: `merged-cell-${rowIndex}-${columnIndex}`,
      mergedRange,
      rows,
      columns,
      fixRows,
      fixColumns,
      rowIndex,
      columnIndex,
      scrollerTop,
      scrollerLeft,
      defaultRowHeight,
      defaultColumnWidth
    };

    if (row.type === 'GROUP' || column.type === 'GROUP') {
      return (
        <GroupLine
            {...mergedCellProps}
            type={row.type === 'GROUP' ? 'column' : 'row'}
            rows={rows}
            columns={columns}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            rowsGroups={rowsGroups}
            columnsGroups={columnsGroups}
            onRowGroupButtonClick={onRowGroupButtonClick}
            onColumnGroupButtonClick={onColumnGroupButtonClick}
            Component={GroupLineComponent} />
      )
    } else {
      return (
        <Cell
            {...mergedCellProps}
            Component={CellComponent}
            mergedCells={mergedCells}
            row={row}
            column={column}
            cell={curCell}
            onSelectedCellsChange={onSelectedCellsChange} />
      )
    }
  });

  const visibleSelections = selectedCells.filter(visibleRangesFilter);
  const visibleSelectionElements = visibleSelections.map((selectedRange, seqIndex) => {   
    const mergedRange = selectedRange;

    const mergedCellProps = {
      key: `selected-cell-${rowsPage}-${columnsPage}-${seqIndex}`,
      mergedRange,
      rows,
      columns,
      fixRows,
      fixColumns,
      scrollerTop,
      scrollerLeft,
      defaultRowHeight,
      defaultColumnWidth
    };

    return <SelectedRangeComponent {...mergedCellProps} multiple={visibleSelections.length > 1} />;
  });

  const fixedAreasElement = (
    <FixLines
        key="fixed-area"
        Component={FixLinesComponent}
        rows={rows}
        columns={columns}
        specialRowsCount={specialRowsCount}
        specialColumnsCount={specialColumnsCount} />
  );

  const elements = [
    ...cellsElements,
    ...mergedCellsElements,
    ...visibleSelectionElements,
    fixedAreasElement
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