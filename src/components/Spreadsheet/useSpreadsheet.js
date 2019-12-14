import { useState, useMemo } from 'react';

/**
 * @param {import('./').useSpreadsheetOptions} options 
 */
const useSpreadsheet = ({
  rows: rowsProps,
  onRowsChange: onRowsChangeProp,
  columns: columnsProp,
  onColumnsChange: onColumnsChangeProp,
  columnNumbersRowHeight,
  rowNumberColumnWidth,
  totalRows,
  totalColumns,
  defaultColumnWidth,
  defaultRowHeight,
  fixRows = 0,
  fixColumns = 0
}) => {
  const [rowsState, setRowsState] = useState([]);
  const rows = useMemo(() => [{ size: columnNumbersRowHeight, type: 'COLUMN_NUMBERS' }, ...(rowsProps || rowsState)], [columnNumbersRowHeight, rowsProps, rowsState]);
  const onRowsChange = onRowsChangeProp || setRowsState;

  const [columnsState, setColumnsState] = useState([]);
  const columns = useMemo(() => [{ size: rowNumberColumnWidth, type: 'ROW_NUMBERS' }, ...(columnsProp || columnsState)], [rowNumberColumnWidth, columnsProp, columnsState]);
  const onColumnsChange = onColumnsChangeProp || setColumnsState;

  const spreadsheetContainerProps = {
    defaultColumnWidth,
    defaultRowHeight,
    onColumnsChange,
    onRowsChange
  };

  const scrollerOptions = {
    rows,
    columns,
    totalRows: totalRows + 1,
    totalColumns: totalColumns + 1,
    fixRows: fixRows + 1,
    fixColumns: fixColumns + 1
  };
  return {
    spreadsheetContainerProps,
    scrollerOptions
  };
};

export default useSpreadsheet;