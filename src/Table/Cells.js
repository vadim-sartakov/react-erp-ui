import React, { useRef, useEffect, createContext, useState, useCallback, useContext } from 'react';
import get from 'lodash/get';
import setIn from 'lodash/fp/set';
import classNames from 'classnames';
import { ScrollerCell } from '../Scroller';

const TextEditComponent = ({
  column,
  rowIndex,
  value: valueProp,
  onChange,
  convertValue,
  createOnBlur,
  createKeyDown,
  ...props
}) => {
  const rootRef = useRef();
  const [value, setValue] = useState(valueProp || '');

  useEffect(() => {
    rootRef.current.focus();
  }, []);

  const handleChange = event => {
    const nextValue = event.target.value;
    setValue(nextValue);
  };

  const convertedValue = convertValue ? convertValue(value) : value;

  return (
    <ScrollerCell
        ref={rootRef}
        Component="input"
        column={column}
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={createOnBlur(convertedValue)}
        onKeyDown={createKeyDown(convertedValue)} />
  );
};

const StringEditComponent = props => <TextEditComponent {...props} />;
const DateEditComponent = props => <TextEditComponent type="date" {...props} />;
const NumberEditComponent = props => {
  return (
    <TextEditComponent
        type="number"
        convertValue={value => parseFloat(value.toString())}
        {...props} />
  );
};

export const defaultEditComponents = {
  string: StringEditComponent,
  date: DateEditComponent,
  number: NumberEditComponent
};

const CellsRowContext = createContext();

const CellsRow = ({ children }) => {
  const [hoverRow, onHoverRowChange] = useState();
  return (
    <CellsRowContext.Provider value={{ hoverRow, onHoverRowChange }}>
      {children}
    </CellsRowContext.Provider>
  )
};

const Cell = ({ value, column, ...props }) => {
  return (
    <ScrollerCell column={column} {...props}>
      {column.format ? column.format(value) : value}
    </ScrollerCell>
  )
};

const EditCellWrapper = ({
  Component,
  value: valueProp,
  onRowAdd,
  onChange: onChangeProp,
  rowIndex,
  column,
  onEditingCellChange,
  onSelectedCellsChange,
  totalRows,
  totalColumns,
  ...props
}) => {

  const handleChange = value => {
    onChangeProp(sourceValue => {
      const nextValue = setIn(`[${rowIndex}].${column.valuePath}`, value, sourceValue);
      return nextValue;
    });
  };

  const createOnBlur = value => () => {
    handleChange(value);
    onEditingCellChange(undefined);
  };

  const createKeyDown = value => event => {
    switch(event.key) {
      case 'Escape':
        onEditingCellChange(undefined);
        break;
      case 'Enter':
        handleChange(value);
        onEditingCellChange(undefined);
        break;
      case 'Tab':
        handleChange(value);
        onEditingCellChange(editingCell => {
          let nextEditingCell;
          if (editingCell.row === totalRows - 1 && editingCell.column === totalColumns - 1 && onRowAdd) {
            onRowAdd();
            nextEditingCell = { row: totalRows, column: 0 };
          } else if (editingCell.column === totalColumns - 1) {
            nextEditingCell = { row: editingCell.row + 1, column: 0 };
          } else {
            nextEditingCell = { row: editingCell.row, column: editingCell.column + 1 };
          }
          onSelectedCellsChange([nextEditingCell]);
          return nextEditingCell;
        });
        break;
      default:
    }
  };

  return (
    <Component
        rowIndex={rowIndex}
        column={column}
        value={valueProp}
        onChange={handleChange}
        createOnBlur={createOnBlur}
        createKeyDown={createKeyDown}
        {...props} />
  )
};

const CellWrapper = ({
  defaultEditComponents = {},
  readOnly,
  value,
  onChange,
  columns,
  selectedCells,
  onSelectedCellsChange,
  onRowAdd,
  rowIndex,
  columnIndex,
  editingCell,
  onEditingCellChange,
  totalRows,
  totalColumns
}) => {
  const { hoverRow, onHoverRowChange } = useContext(CellsRowContext);

  const column = columns[columnIndex];
  const rowValue = value[rowIndex];
  const curValue = get(rowValue, column.valuePath);
  const editing = !readOnly && editingCell && (editingCell.row === rowIndex && editingCell.column === columnIndex);
  const selectedRow = selectedCells.some(selectedCell => selectedCell.row === rowIndex);
  const selectedCell = selectedCells.some(selectedCell => selectedCell.row === rowIndex && selectedCell.column === columnIndex);

  const onMouseEnter = useCallback(() => onHoverRowChange(true), [onHoverRowChange]);
  const onMouseLeave = useCallback(() => onHoverRowChange(false), [onHoverRowChange]);

  const handleSelect = useCallback(({ ctrlKey, shiftKey }) => {
    onSelectedCellsChange(selectedCells => {
      const lastSelection = selectedCells[selectedCells.length - 1];
      const curSelection = { row: rowIndex, column: columnIndex };

      let nextSelection;
      if (ctrlKey && lastSelection) {
        nextSelection = [...selectedCells, curSelection];
      } else if (shiftKey && lastSelection) {
        const startRowIndex = selectedCells.reduce((prev, selection) => Math.min(prev, selection.row, curSelection.row), value.length - 1);
        const endRowIndex = selectedCells.reduce((prev, selection) => Math.max(prev, selection.row, curSelection.row), 0);
        nextSelection = [];
        for (let i = startRowIndex; i <= endRowIndex; i++) {
          nextSelection.push({ row: i });
        }
      } else {
        nextSelection = [curSelection];
      }      
      return nextSelection;
    });
  }, [columnIndex, rowIndex, onSelectedCellsChange, value.length]);

  const startEditCell = useCallback(() => {
    onEditingCellChange({ row: rowIndex, column: columnIndex });
  }, [onEditingCellChange, rowIndex, columnIndex]);

  const baseComponentProps = {
    rowIndex,
    columnIndex,
    column,
    value: curValue,
    onMouseDown: handleSelect,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    className: classNames(
      'cell',
      column.type || 'string',
      {
        'hover-row': hoverRow,
        'selected-row': selectedRow,
        'selected-cell': selectedCell
      }
    )
  };

  const EditComponent = column.EditComponent || defaultEditComponents[column.type || 'string'];
  const ValueComponent = column.Component || Cell;

  let Component, componentProps;
  if (editing && EditComponent) {
    Component = EditCellWrapper;
    componentProps = {
      ...baseComponentProps,
      Component: EditComponent,
      className: classNames(baseComponentProps.className, 'edit'),
      onChange,
      onEditingCellChange,
      onSelectedCellsChange,
      onRowAdd,
      totalRows,
      totalColumns
    };
  } else {
    Component = ValueComponent;
    componentProps = {
      ...baseComponentProps,
      onDoubleClick: startEditCell
    };
  }

  return <Component {...componentProps} />;
};

const Cells = React.memo(({
  visibleRows,
  visibleColumns,
  ...props
}) => {
  return visibleRows.map(rowIndex => {
    const columnsElements = (
      <CellsRow key={rowIndex}>
        {visibleColumns.map(columnIndex => {
          return (
            <CellWrapper
                key={`${rowIndex}-${columnIndex}`}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                {...props} />
          );
        })}
      </CellsRow>
    );
    return columnsElements;
  }, [])
});

export default Cells;