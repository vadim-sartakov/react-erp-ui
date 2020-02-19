import { useState, useRef, useMemo } from 'react';

/**
 * @param {import('./').UseTableOptions} options
 * @returns {import('./').UseTableResult}
 */
const useTable = ({
  columns: columnsProp
}) => {
  const [columns, onColumnsChange] = useState(columnsProp);
  const [selectedCells, onSelectedCellsChange] = useState([]);

  const [resizeInteraction, onResizeInteractionChange] = useState();
  const [resizeColumns, onResizeColumns] = useState(columnsProp.map(column => ({ size: column.size })));

  return {
    columns,
    onColumnsChange,
    selectedCells,
    onSelectedCellsChange,
    resizeInteraction,
    onResizeInteractionChange,
    resizeColumns,
    onResizeColumns
  }
};

export default useTable;