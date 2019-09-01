import React, { useRef } from 'react';
import { ScrollerTree } from '../../components';
import classes from './Table.module.sass';

const Table = ({
  rows,
  columns,
  rowsPerPage,
  defaultRowHeight,
  value,
  loadPage
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
          <tr style={{ height: 80 }}>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.width }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ScrollerTree
              value={value}
              loadPage={loadPage}
              meta={rows}
              itemsPerPage={rowsPerPage}
              defaultSize={defaultRowHeight}
              scrollContainerRef={scrollerRef}
              scrollDirection="vertical"
              relativeScroll={80}
              renderGap={height => <tr style={{ height }} />}>
            {({ value: rowValue, meta: rowMeta, depth }) => rowValue.isLoading ? (
              <tr style={{ height: 50 }} colSpan={columns.length}>
                Loading...
              </tr>
            ) : (
              <tr style={{ height: 50 }}>
                {rowValue.columns.map((columnValue, index) => (
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