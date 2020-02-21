import { useState, useRef } from 'react';

/**
 * @param {import('./').UseTableOptions} options
 * @returns {import('./').UseTableResult}
 */
const useTable = ({
  defaultValue,
  value: valueProp,
  onChange: onChangeProp,
  columns: columnsProp
}) => {
  const scrollerContainerRef = useRef();
  const [valueState, setValueState] = useState(defaultValue || []);
  const value = valueProp || valueState;
  const onChange = onChangeProp || setValueState;
  
  const [columns, onColumnsChange] = useState(columnsProp);
  const [selectedCells, onSelectedCellsChange] = useState([]);
  const [editingCell, onEditingCellChange] = useState();

  const totalRows = value.length;
  const totalColumns = Object.keys(value[0]).length;

  return {
    value,
    onChange,
    totalRows,
    totalColumns,
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