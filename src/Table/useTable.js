import { useState, useRef } from 'react';

/**
 * @param {import('./').UseTableOptions} options
 * @returns {import('./').UseTableResult}
 */
const useTable = ({
  columns: columnsProp
}) => {
  const scrollerContainerRef = useRef();
  const [columns, onColumnsChange] = useState(columnsProp);
  const [selectedCells, onSelectedCellsChange] = useState([]);
  const [editingCell, onEditingCellChange] = useState();

  return {
    scrollerContainerRef,
    columns,
    onColumnsChange,
    selectedCells,
    onSelectedCellsChange,
    editingCell,
    onEditingCellChange
  }
};

export default useTable;