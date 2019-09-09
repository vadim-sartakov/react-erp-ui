import React, { useRef, useState } from 'react';
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
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  return (
    <div
        ref={scrollerRef}
        style={{
          overflow: 'auto',
          height: 600,
          // This is important for Chrome
          overflowAnchor: 'none'
        }}
        onScroll={e => setScroll({ top: e.target.scrollTop, left: e.target.scrollLeft })}>
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
              relativeScroll={80}
              renderGap={height => <tr style={{ height }} />}
              scroll={scroll}>
                                  {/*Row loading supposed to be here, in meta*/}
            {({ index, value: rowValue, meta: rowMeta, depth, isGroup }) => rowValue.isLoading ? (
              <tr key={index} style={{ height: 50 }}>
                <td className={classes.loading} colSpan={columns.length}>Loading...</td>
              </tr>
            ) : (
              <tr key={index} style={{ height: 50 }}>
                {rowValue.columns.map((columnValue, index) => (
                  <td key={index}>
                    <span style={{ marginLeft: depth && index === 0 ? depth * 15 : undefined }}>
                      {columnValue.value}
                    </span>
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