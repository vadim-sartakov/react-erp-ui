import React, { useMemo, useCallback } from 'react';
import GroupLevelButton from './GroupLevelButton';
import { GroupLine, RowColumnNumber, SpreadsheetCell } from './';
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
  fixRows,
  fixColumns,
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
            row={row}
            column={column}
            rows={rows}
            columns={columns}
            mergedRange={groupMergedRange}
            rowIndex={rowIndex}
            collapsed={rowGroup.collapsed}
            overscrolled={overscrolled}
            onClick={handleButtonClick}/> : !overscrolled && renderGroupEmptyArea({ row, column, rowIndex, columnIndex });
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

        switch(rowType) {
          case 'GROUP':

            switch(columnsType) {
              case 'GROUP':
                return <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>{renderGroupEmptyArea({ row, column, rowIndex, columnIndex })}</React.Fragment>;
              case 'NUMBER':
                const groupLevelButtonProps = { row, column, index: rowIndex, onClick: onColumnGroupLevelButtonClick(rowIndex + 1) };
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {renderColumnGroupCallback({ row, column, rowIndex, columnIndex, overscrolled: true })}
                    <GroupLevelButtonComponent {...groupLevelButtonProps} />
                  </React.Fragment>
                );
              default:
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {renderColumnGroupCallback({ row, column, rowIndex, columnIndex })}
                  </React.Fragment>
                );
            }
          case 'NUMBER':

            switch(columnsType) {
              case 'GROUP':
                const groupLevelButtonProps = { row, column, index: columnIndex, onClick: onRowGroupLevelButtonClick(columnIndex + 1) };
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {renderRowGroupCallback({ row, column, rowIndex, columnIndex, overscrolled: true })}
                    <GroupLevelButtonComponent {...groupLevelButtonProps} />
                  </React.Fragment>  
                );
              case 'NUMBER':
                return <RowColumnNumberComponent key={`${seqRowIndex}_${seqColumnIndex}`} row={row} column={column} intersection />;
              default:
                return (
                  <RowColumnNumberComponent
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="column"
                      row={row}
                      column={column}
                      index={columnIndex}
                      onRowsChange={onRowsChange}
                      onColumnsChange={onColumnsChange} />
                );
            }

          default:
            const rowValue = value[rowIndex];
            const curValue = rowValue && rowValue[columnIndex];
            
            switch(columnsType) {
              case 'GROUP':
                return (
                  <React.Fragment key={`${seqRowIndex}_${seqColumnIndex}`}>
                    {renderRowGroupCallback({ row, column, rowIndex, columnIndex })}
                  </React.Fragment>
                );
              case 'NUMBER':
                return (
                  <RowColumnNumberComponent
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      type="row"
                      row={row}
                      column={column}
                      index={rowIndex}
                      onRowsChange={onRowsChange}
                      onColumnsChange={onColumnsChange} />
                );
              default:
                return (
                  <SpreadsheetCell
                      key={`${seqRowIndex}_${seqColumnIndex}`}
                      row={row}
                      column={column}>
                    <CellComponent value={curValue} />
                  </SpreadsheetCell>
                );
            }
        }

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
    onColumnsChange
  ]);

  const mergedCellsElement = (
    <MergedCells
        key="merged-cells"
        rows={rows}
        columns={columns}
        mergedCells={mergedCells}
        scrollerTop={scrollerTop}
        scrollerLeft={scrollerLeft}
        visibleRows={visibleRows}
        visibleColumns={visibleColumns}
        value={value}
        CellComponent={CellComponent} />
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
    mergedCellsElement,
    fixedAreasElement
  ];
};

export default useSpreadsheetRender;