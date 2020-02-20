import React, { useRef, useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import setIn from 'lodash/fp/set';
import { useTable, useKeyboard, TableContext } from './';
import { useScroller, ScrollerContainer, ScrollerCell } from '../Scroller';
import GridResizer from '../grid/GridResizer';

const StringEditComponent = ({ column, rowIndex, value: valueProp, onChange, onEditingCellChange, ...props }) => {
  const [value, setValue] = useState(valueProp || '');
  const rootRef = useRef();

  useEffect(() => {
    rootRef.current.focus();
  }, []);

  const handleChange = useCallback(event => {
    setValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onChange(sourceValue => {
      const nextValue = setIn(`[${rowIndex}].${column.valuePath}`, value, sourceValue);
      return nextValue;
    });
    onEditingCellChange(undefined);
  }, [onChange, onEditingCellChange, column.valuePath, rowIndex, value]);

  return (
    <ScrollerCell
        ref={rootRef}
        Component="input"
        column={column}
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur} />
  );
};

const defaultEditComponents = {
  string: StringEditComponent
};

const Heading = ({ index, onColumnsChange, column, defaultColumnWidth, style }) => {
  return (
    <ScrollerCell
        className={classNames('header', column.type || 'string')}
        column={column}
        style={style}>
      {column.title}
      <GridResizer
          type="column"
          className="column-resizer"
          index={index}
          defaultSize={defaultColumnWidth}
          meta={column}
          onMouseMove={onColumnsChange} />
    </ScrollerCell>
  )
};

const Header = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.HeaderComponent || Heading;
    const fixedIntersection = index < props.fixColumns;
    const style = {
      position: 'sticky',
      top: 0,
      zIndex: fixedIntersection ? 4 : 3
    };
    return (
      <Component
          key={index}
          index={index}
          column={column}
          onColumnsChange={props.onColumnsChange}
          defaultColumnWidth={props.defaultColumnWidth}
          style={style} />
    )
  })
});

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

const CellWrapper = ({
  defaultEditComponents = {},
  readOnly,
  value,
  onChange,
  columns,
  selectedCells,
  onSelectedCellsChange,
  rowIndex,
  columnIndex,
  editingCell,
  onEditingCellChange
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

  const handleStartEdit = useCallback(() => {
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
  const ValueComponent = (editing && EditComponent) || column.Component || Cell;

  let Component, componentProps;
  if (editing && EditComponent) {
    Component = EditComponent;
    componentProps = {
      ...baseComponentProps,
      className: classNames(baseComponentProps.className, 'edit'),
      onChange,
      onEditingCellChange
    };
  } else {
    Component = ValueComponent;
    componentProps = {
      ...baseComponentProps,
      onDoubleClick: handleStartEdit
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

const FooterItem = ({ value, column, style }) => {
  const footerValue = column.footerValue && column.footerValue(value);
  return (
    <ScrollerCell
        className={classNames('footer', column.type || 'string')}
        column={column}
        style={style}>
      {footerValue}
    </ScrollerCell>
  )
};

const Footer = React.memo(props => {
  return props.columns.map((column, index) => {
    const Component = column.FooterComponent || FooterItem;
    const fixedIntersection = index < props.fixColumns;
    const style = {
      position: 'sticky',
      bottom: 0,
      zIndex: fixedIntersection ? 4 : 3
    };
    return (
      <Component
          key={index}
          value={props.value}
          column={column}
          style={style} />
    )
  })
});

/**
 * @type {import('react').FunctionComponent<import('./').TableProps>}
 */
const Table = inputProps => {
  let props = { defaultEditComponents, ...inputProps };
  const tableProps = useTable(props);
  props = { ...props, ...tableProps };
  const scrollerProps = useScroller(props);
  props = { ...props, ...scrollerProps };

  const onKeyDown = useKeyboard(props);

  const contextValue = useMemo(() => ({
    defaultColumnWidth: props.defaultColumnWidth,
    defaultRowHeight: props.defaultRowHeight,
    fixRows: props.fixRows,
    fixColumns: props.fixColumns
  }), [
    props.defaultColumnWidth,
    props.defaultRowHeight,
    props.fixRows,
    props.fixColumns
  ]);

  const headerElement = (
    <Header
        fixColumns={props.fixColumns}
        columns={props.columns}
        onColumnsChange={props.onColumnsChange}
        headerRows={props.headerRows}
        defaultColumnWidth={props.defaultColumnWidth} />
  );
  const cellsElement = (
    <Cells
        defaultEditComponents={props.defaultEditComponents}
        readOnly={props.readOnly}
        editingCell={props.editingCell}
        onEditingCellChange={props.onEditingCellChange}
        selectedCells={props.selectedCells}
        onSelectedCellsChange={props.onSelectedCellsChange}
        visibleRows={props.visibleRows}
        visibleColumns={props.visibleColumns}
        value={props.value}
        onChange={props.onChange}
        columns={props.columns} />
  );
  const footerElement = props.showFooter ? (
    <Footer
        value={props.value}
        columns={props.columns}
        fixColumns={props.fixColumns} />
  ) : null;

  return (
    <TableContext.Provider value={contextValue}>
      <ScrollerContainer
          ref={props.scrollerContainerRef}
          className={classNames('table', props.className)}
          onKeyDown={onKeyDown}
          defaultRowHeight={props.defaultRowHeight}
          defaultColumnWidth={props.defaultColumnWidth}
          onScroll={props.onScroll}
          width={props.width}
          height={props.height}>
        <div ref={props.scrollerCoverRef}
            style={props.coverStyles}>
          <div style={props.pagesStyles}>
            <div style={{ ...props.gridStyles, userSelect: 'none' }}>
              {headerElement}
              {cellsElement}
              {footerElement}
            </div>
          </div>
        </div>
      </ScrollerContainer>
    </TableContext.Provider>
  );
};

export default Table;