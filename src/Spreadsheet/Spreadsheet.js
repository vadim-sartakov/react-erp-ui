import React from 'react';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import { SpreadsheetContainer, useSpreadsheet } from './';
import GroupLevelButton from './GroupLevelButton';
import { Heading, HeadingsIntersection } from './Heading';
import { GroupLine } from './GroupLine';
import FixLines from './FixLines';
import MergedCell from '../MergedCell';
import SpecialCellEmptyArea from './SpecialCellEmptyArea';
import Cell from './Cell';

export const visibleMergesFilter = ({
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
  const spreadsheetProps = useSpreadsheet(inputProps);

  const { gridStyles, ...scrollerProps } = useScroller({
    ...inputProps,
    ...spreadsheetProps
  });

  const props = {
    ...inputProps,
    ...spreadsheetProps,
    ...scrollerProps
  };

  const scrollerTop = scrollerProps.pagesStyles.top;
  const scrollerLeft = scrollerProps.pagesStyles.left;

  const {
    value,
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
    HeadingComponent = Heading,
    HeadingsIntersectionComponent = HeadingsIntersection,
    GroupLevelButtonComponent = GroupLevelButton,
    GroupLineComponent,
    FixLinesComponent,
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

      let element, spreadsheetCellProps;

      const isMerged = !rowType && !columnsType ? mergedCells.some(mergedRange =>
          rowIndex >= mergedRange.start.row &&
          columnIndex >= mergedRange.start.column &&
          rowIndex <= mergedRange.end.row &&
          columnIndex <= mergedRange.end.column) : false;

      if (!isMerged) {
        
        switch(rowType) {
          case 'GROUP':

            switch(columnsType) {
              case 'NUMBER':
                spreadsheetCellProps = { style: { zIndex: 8 } };
                element = <GroupLevelButtonComponent index={rowIndex} onClick={onColumnGroupLevelButtonClick(rowIndex + 1)} />;
                break;
              default:
                element = <SpecialCellEmptyAreaComponent />;
            }
            break;
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                spreadsheetCellProps = { style: { zIndex: 8 } };
                element = <GroupLevelButtonComponent index={columnIndex} onClick={onRowGroupLevelButtonClick(columnIndex + 1)} />;
                break;
              case 'NUMBER':
                element = <HeadingsIntersectionComponent />;
                break;
              default:
                element = (
                  <HeadingComponent
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="column"
                      meta={column}
                      defaultSize={defaultColumnWidth}
                      index={columnIndex}
                      onChange={onColumnsChange} />
                );
                break;
            }
            break;
          default:
            const rowValue = value[rowIndex];
            const curValue = rowValue && rowValue[columnIndex];
            
            switch(columnsType) {
              case 'GROUP':
                element = <SpecialCellEmptyArea />;
                break
              case 'NUMBER':
                element = (
                  <Heading
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="row"
                      meta={row}
                      index={rowIndex}
                      defaultSize={defaultRowHeight}
                      onChange={onRowsChange} />
                );
                break;
              default:
                element = <Cell value={curValue} Component={CellComponent} />;
            }
        }
      }

      return (
        <ScrollerCell
              key={`${seqRowIndex}_${seqColumnIndex}`}
              row={row}
              column={column}
              {...spreadsheetCellProps}>
          {element}
        </ScrollerCell>
      );

    });

    return [...acc, ...columnsElements];   
  }, []);

  const visibleMerges = mergedCells.filter(visibleMergesFilter({ fixRows, fixColumns, visibleRows, visibleColumns }));

  const mergedCellsElements = visibleMerges.map(mergedRange => {
    const columnIndex = mergedRange.start.column;
    const rowIndex = mergedRange.start.row;

    const row = rows[rowIndex] || {};
    const column = columns[columnIndex] || {};
    const rowValue = value[rowIndex];
    const curValue = rowValue && rowValue[columnIndex];

    const mergedCellProps = {
      key: `merged-cell-${rowIndex}-${columnIndex}`,
      mergedRange,
      rows,
      columns,
      rowIndex,
      columnIndex,
      fixRows,
      fixColumns,
      scrollerTop,
      scrollerLeft,
      defaultRowHeight,
      defaultColumnWidth
    };

    if (row.type === 'GROUP' || column.type === 'GROUP') {
      return (
        <MergedCell {...mergedCellProps}>
          <GroupLine
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
        </MergedCell>
      )
    } else {
      return (
        <MergedCell {...mergedCellProps}>
          <Cell value={curValue} Component={CellComponent} />
        </MergedCell>
      )
    }
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
    fixedAreasElement
  ];

  return (
    <ScrollerContainer
          {...props}
          {...scrollerProps}>
      <SpreadsheetContainer
          {...props}
          {...spreadsheetProps}
          style={gridStyles}>
        {elements}
      </SpreadsheetContainer>
    </ScrollerContainer>
  );
};

export default Spreadsheet;