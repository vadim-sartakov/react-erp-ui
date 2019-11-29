const renderBody = ({
  rows,
  columns,
  visibleRows,
  visibleColumns,
  value: syncValue,
  renderIntersectionColumn,
  renderColumnNumber,
  renderRowNumber,
  renderCellValue
}) => {
  const mergedCells = [];
  return visibleRows.reduce((acc, rowIndex) => {
    const row = rows[rowIndex] || {};
    let columnsElements;
    const rowType = row.type || 'VALUES';
    switch(rowType) {
      case 'COLUMN_NUMBERS':
        columnsElements = visibleColumns.map(columnIndex => {
          const column = columns[columnIndex] || {};
          let columnElement;
          const columnsType = column.type || 'VALUES';
          switch(columnsType) {
            case 'ROW_NUMBER':
              columnElement = renderIntersectionColumn({ row, column, columnIndex });
              break;
            default:
              columnElement = renderColumnNumber({ row, column, columnIndex });
              break;
          }
          return columnElement;
        });
        break;
      case 'VALUES':
        columnsElements = visibleColumns.map(columnIndex => {
          const column = columns[columnIndex] || {};
          const rowValue = syncValue[rowIndex - 1];
          const value = rowValue && rowValue[columnIndex - 1];

          if (value && (value.rowSpan || value.colSpan)) {
            for (let i = 0; i < value.rowSpan ; i++) {
              for (let j = 0; j < value.colSpan ; j++) {
                const resultRowIndex = rowIndex + i;
                const resultColumnIndex = columnIndex + j;
                (i > 0 || j > 0) && mergedCells.push([resultRowIndex, resultColumnIndex]);
              }
            }
          };
          
          let element;
          const columnsType = column.type || 'VALUES';
          switch(columnsType) {
            case 'ROW_NUMBER':
              element = renderRowNumber({ row, column, rowIndex, columnIndex });
              break;
            default:
              const cellIsMerged = mergedCells.some(([row, column]) => row === rowIndex && column === columnIndex);
              element = !cellIsMerged && renderCellValue({ row, rowIndex, column, columnIndex, value, columns, rows });
              break;
          }
          return element;
        });
        break;
      default:
    }

    return [acc, ...columnsElements];   
  }, [])
};

export default renderBody;