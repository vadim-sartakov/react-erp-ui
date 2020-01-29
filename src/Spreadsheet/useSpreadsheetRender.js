import React, { useMemo } from 'react';
import GroupLevelButton from './GroupLevelButton';
import { SpreadsheetCell } from './';
import { RowColumnNumber, RowColumnNumberIntersection } from './RowColumnNumber';
import { GroupLine } from './GroupLine';
import FixLines from './FixLines';
import MergedCell from './MergedCell';
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

/**
 * @param {import('.').UseSpreadsheetRenderOptions} options
 * @returns {JSX.Element}
 */
const useSpreadsheetRender = ({
  value,
  visibleRows,
  visibleColumns,
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
  scrollerTop,
  scrollerLeft,
  onRowGroupLevelButtonClick,
  onColumnGroupLevelButtonClick,
  onRowGroupButtonClick,
  onColumnGroupButtonClick
}) => {
  const cellsElements = useMemo(() => {
    return visibleRows.reduce((acc, rowIndex, seqRowIndex) => {
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
              const rowValue = value[rowIndex - specialRowsCount];
              const curValue = rowValue && rowValue[columnIndex - specialColumnsCount];
              
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
    }, [])
  }, [
    rows,
    columns,
    visibleRows,
    visibleColumns,
    value,
    onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick,
    onRowsChange,
    onColumnsChange,
    mergedCells,
    specialRowsCount,
    specialColumnsCount
  ]);

  const visibleMerges = mergedCells.filter(visibleMergesFilter({ fixRows, fixColumns, visibleRows, visibleColumns }));

  const mergedCellsElements = visibleMerges.map(mergedRange => {
    const columnIndex = mergedRange.start.column;
    const rowIndex = mergedRange.start.row;

    const row = rows[rowIndex] || {};
    const column = columns[columnIndex] || {};
    const rowValue = value[rowIndex - specialRowsCount];
    const curValue = rowValue && rowValue[columnIndex - specialColumnsCount];

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
      scrollerLeft
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

  return [
    ...cellsElements,
    ...mergedCellsElements,
    fixedAreasElement
  ];
};

export default useSpreadsheetRender;