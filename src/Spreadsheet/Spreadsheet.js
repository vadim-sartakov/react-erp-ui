import React from 'react';
import { useScroller, ScrollerContainer } from '../Scroller';
import { SpreadsheetContainer, SpreadsheetCell, useSpreadsheet } from './';
import GroupLevelButton from './GroupLevelButton';
import { RowColumnNumber, RowColumnNumberIntersection } from './RowColumnNumber';
import { GroupLine } from './GroupLine';
import FixLines from './FixLines';
import MergedCell from '../MergedCell';
import SpecialCellEmptyArea from './SpecialCellEmptyArea';

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
    RowColumnNumberComponent = RowColumnNumber,
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
                element = <SpecialCellEmptyArea />;
            }
            break;
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                spreadsheetCellProps = { style: { zIndex: 8 } };
                element = <GroupLevelButtonComponent index={columnIndex} onClick={onRowGroupLevelButtonClick(columnIndex + 1)} />;
                break;
              case 'NUMBER':
                element = <RowColumnNumberIntersection />;
                break;
              default:
                element = (
                  <RowColumnNumberComponent
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="column"
                      row={row}
                      column={column}
                      index={columnIndex}
                      onRowsChange={onRowsChange}
                      onColumnsChange={onColumnsChange} />
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
                  <RowColumnNumberComponent
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="row"
                      row={row}
                      column={column}
                      index={rowIndex}
                      onRowsChange={onRowsChange}
                      onColumnsChange={onColumnsChange} />
                );
                break;
              default:
                element = <CellComponent value={curValue} />;
            }
        }
      }

      return (
        <SpreadsheetCell
              key={`${seqRowIndex}_${seqColumnIndex}`}
              row={row}
              column={column}
              {...spreadsheetCellProps}>
          {element}
        </SpreadsheetCell>
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
          <CellComponent value={curValue} />
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