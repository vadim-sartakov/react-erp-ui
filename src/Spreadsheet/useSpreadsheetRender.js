import React, { useMemo, useCallback } from 'react';
import GroupLevelButton from './GroupLevelButton';
import { SpreadsheetCell } from './';
import { RowColumnNumber, RowColumnNumberIntersection } from './RowColumnNumber';
import { GroupLine, GroupLineView } from './GroupLine';
import FixLines from './FixLines';
import MergedCells from './MergedCells';

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
  GroupLineComponent = GroupLine,
  FixLinesComponent,
  renderGroupEmptyArea,
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
  const renderRowGroupCallback = useCallback(({ rowIndex, columnIndex, row, column, overscrolled }) => {
    const currentLevelGroups = rowsGroups[columnIndex];
    const rowGroup = currentLevelGroups && currentLevelGroups.find(group => (group.offsetStart - 1) === rowIndex);
    const groupMergedRange = rowGroup && mergedCells.find(range => range.start.row === rowIndex && range.start.column === columnIndex);
    const handleButtonClick = onRowGroupButtonClick(rowGroup);
    return groupMergedRange ?
        <GroupLineComponent
            type="row"
            rows={rows}
            columns={columns}
            rowIndex={rowIndex}
            collapsed={rowGroup.collapsed}
            overscrolled={overscrolled}
            onClick={handleButtonClick}
            GroupLineView={GroupLineView} /> : !overscrolled && renderGroupEmptyArea({ row, column, rowIndex, columnIndex });
  }, [rows, columns, renderGroupEmptyArea, rowsGroups, onRowGroupButtonClick, mergedCells]);

  const renderColumnGroupCallback = useCallback(({ rowIndex, columnIndex, row, column, overscrolled }) => {
    const currentLevelGroups = columnsGroups[rowIndex];
    const columnGroup = currentLevelGroups && currentLevelGroups.find(group => (group.offsetStart - 1) === columnIndex);
    const groupMergedRange = columnGroup && mergedCells.find(range => range.start.row === rowIndex && range.start.column === columnIndex);
    const handleButtonClick = onColumnGroupButtonClick(columnGroup);
    return groupMergedRange ?
        <GroupLineComponent
            type="column"
            row={row}
            column={column}
            rows={rows}
            columns={columns}
            mergedRange={groupMergedRange}
            columnIndex={columnIndex}
            collapsed={columnGroup.collapsed}
            overscrolled={overscrolled}
            onClick={handleButtonClick} /> : !overscrolled && renderGroupEmptyArea({ row, column, rowIndex, columnIndex });
  }, [rows, columns, renderGroupEmptyArea, columnsGroups, onColumnGroupButtonClick, mergedCells]);

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
                case 'GROUP':
                  element = <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
                  break;
                case 'NUMBER':
                  spreadsheetCellProps = { style: { zIndex: 8 } };
                  element = <GroupLevelButtonComponent index={rowIndex} onClick={onColumnGroupLevelButtonClick(rowIndex + 1)} />;
                  break;
                default:
                  element = (
                    <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                      {renderColumnGroupCallback({ row, column, rowIndex, columnIndex })}
                    </React.Fragment>
                  );
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
                  element = (
                    <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                      {renderRowGroupCallback({ row, column, rowIndex, columnIndex })}
                    </React.Fragment>
                  );
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

      return [acc, ...columnsElements];   
    }, [])
  }, [
    rows,
    columns,
    visibleRows,
    visibleColumns,
    value,
    renderGroupEmptyArea,
    renderRowGroupCallback,
    renderColumnGroupCallback,
    onRowGroupLevelButtonClick,
    onColumnGroupLevelButtonClick,
    onRowsChange,
    onColumnsChange,
    mergedCells,
    specialRowsCount,
    specialColumnsCount
  ]);

  const valueMergedCells = useMemo(() => {
    return mergedCells.filter(mergedRange => {
      return mergedRange.start.row >= specialRowsCount && mergedRange.start.column >= specialColumnsCount
    })
  }, [mergedCells, specialRowsCount, specialColumnsCount]);

  const mergedValueCells = (
    <MergedCells
        key="value-merged-cells"
        rows={rows}
        columns={columns}
        value={value}
        fixRows={fixRows}
        fixColumns={fixColumns}
        specialRowsCount={specialRowsCount}
        specialColumnsCount={specialColumnsCount}
        mergedCells={valueMergedCells}
        scrollerTop={scrollerTop}
        scrollerLeft={scrollerLeft}
        visibleRows={visibleRows}
        visibleColumns={visibleColumns}
        CellComponent={CellComponent} />
  );

  const specialMergedCells = useMemo(() => {
    return mergedCells.filter(mergedRange => {
      return mergedRange.start.row < specialRowsCount || mergedRange.start.column < specialColumnsCount
    })
  }, [mergedCells, specialRowsCount, specialColumnsCount]);

  const mergedSpecialCells = (
    <MergedCells
        key="special-merged-cells"
        rows={rows}
        columns={columns}
        value={value}
        fixRows={fixRows}
        fixColumns={fixColumns}
        specialRowsCount={specialRowsCount}
        specialColumnsCount={specialColumnsCount}
        mergedCells={specialMergedCells}
        scrollerTop={scrollerTop}
        scrollerLeft={scrollerLeft}
        visibleRows={visibleRows}
        visibleColumns={visibleColumns}
        CellComponent="div"
        componentProps={{
          style: { backgroundColor: 'red', height: '100%' }
        }} />
  );

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
    mergedValueCells,
    mergedSpecialCells,
    fixedAreasElement
  ];
};

export default useSpreadsheetRender;