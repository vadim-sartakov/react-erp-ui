import React, { useMemo } from 'react';

const useScrollerRender = ({
  CellComponent,
  visibleRows,
  visibleColumns,
  loadedValues,
  rows,
  columns,
  value
}) => {
  const elements = useMemo(() => visibleRows.reduce((acc, rowIndex) => {
    const row = rows && rows[rowIndex];
    if (visibleColumns) {
      const columnsElements = visibleColumns.map(columnIndex => {
        const column = columns && columns[columnIndex];
        const valueArray = loadedValues || value;
        const curValue = valueArray[rowIndex] && valueArray[rowIndex][columnIndex];
        return <CellComponent key={`${rowIndex}-${columnIndex}`} row={row} column={column} rowIndex={columnIndex} columnIndex={columnIndex} value={curValue} />;
      });
      return [...acc, ...columnsElements];
    } else {
      const valueArray = loadedValues || value;
      const curValue = valueArray[rowIndex];
      const rowElement = <CellComponent key={rowIndex} row={row} rowIndex={rowIndex} value={curValue} />;
      return [...acc, rowElement];
    }
  }, []), [rows, columns, visibleRows, visibleColumns, loadedValues, value]);
  return elements;
};

export default useScrollerRender;