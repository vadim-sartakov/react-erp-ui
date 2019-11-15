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
              // TODO: Wrong. Got to run one reversed loop over all preceding rows and columns
              const columnMerged = visibleColumns.slice(0, columnIndex).reverse().some(columnSpanIndex => {
                const rowValue = visibleValues[rowIndex - 1];
                const columnValue = rowValue && rowValue[columnSpanIndex - 1];
                if (columnValue && columnValue.colSpan) {
                  const range = columnIndex - (columnSpanIndex - 1);
                  return range <= columnValue.colSpan;
                } else {
                  return false;
                }
              });

              const rowMerged = visibleRows.slice(0, rowIndex).reverse().some(rowSpanIndex => {
                const rowValue = visibleValues[rowSpanIndex - 1];
                const columnValue = rowValue && rowValue[columnIndex - 1];
                if (columnValue && columnValue.rowSpan) {
                  const range = rowIndex - (rowSpanIndex - 1);
                  return range <= columnValue.rowSpan;
                } else {
                  return false;
                }
              });
              element = !columnMerged && !rowMerged && renderCellValue({ row, rowIndex, column, columnIndex, value, columns, rows });
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