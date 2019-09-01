import React, { useRef } from 'react';
import { ScrollerTree } from '../../components';
import classes from './Table.module.sass';

const Table = ({
  rows,
  columns,
  rowsPerPage,
  defaultRowHeight,
  value
}) => {
  const scrollerRef = useRef();
  return (
    <div
        ref={scrollerRef}
        style={{
          overflow: 'auto',
          height: 400,
          // This is important for Chrome
          overflowAnchor: 'none'
        }}>
      <table className={classes.table}>
        <thead>
          <tr style={{ height: 60 }}>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.size }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ScrollerTree
              value={value}
              meta={rows}
              itemsPerPage={rowsPerPage}
              defaultSize={defaultRowHeight}
              scrollContainerRef={scrollerRef}
              scrollDirection="vertical"
              relativeScroll={60}
              renderGap={height => <tr style={{ height }} />}>
            {({ value: rowValue, meta: rowMeta, depth }) => (
              <tr>
                {rowValue.column.map((columnValue, index) => (
                  <td key={index}>
                    {columnValue.value}
                  </td>
                ))}
              </tr>
            )}
          </ScrollerTree>
        </tbody>
      </table>
    </div>
  )
};

export default Table;