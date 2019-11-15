const renderBody = ({
  rows,
  columns,
  visibleRows,
  visibleColumns,
  visibleValues,
  renderIntersectionColumn,
  renderColumnNumber,
  renderRowNumber,
  renderCellValue
}) => {
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
          const rowValue = visibleValues[rowIndex - 1];
          const value = rowValue && rowValue[columnIndex - 1];
          let element;
          const columnsType = column.type || 'VALUES';
          switch(columnsType) {
            case 'ROW_NUMBER':
              element = renderRowNumber({ row, column, rowIndex, columnIndex });
              break;
            default:
              element = renderCellValue({ row, rowIndex, column, columnIndex, value, columns, rows });
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