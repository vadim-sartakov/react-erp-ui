import React, { useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Scroller from './Scroller';
import classes from './Scroller-stories.module.sass';

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
          <Scroller
              value={value}
              loadPage={loadPage}
              meta={rows}
              itemsPerPage={rowsPerPage}
              defaultSize={defaultRowHeight}
              relativeScroll={80}
              renderGap={height => <tr style={{ height }} />}
              scroll={scroll.top}>
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
          </Scroller>
        </tbody>
      </table>
    </div>
  )
};

const generateColumns = count => {
  return [...new Array(count).keys()].map(item => ({ title: `Column ${item}`, width: 200 }));
};

const generateValues = (columns, count) => {
  return [...new Array(count).keys()].map((rowItem, rowIndex) => {
    const rowColumns = columns.map((column, columnIndex) => ({ value: `Value ${rowIndex} - ${columnIndex}` }));
    return { columns: rowColumns };
  });
};

/*storiesOf('Scroller', module)
  .add('static table with scrollable rows', () => {
    const columns = generateColumns(8);
    const rows = { children: [] };
    const value = generateValues(columns, 1000);
    value[100].children = generateValues(columns, 200);
    rows.children[100] = { expanded: true, children: [] };

    // Total count is not set here for some reason
    value[100].children[50].children = generateValues(columns, 100);
    rows.children[100].children[50] = { expanded: true, children: [] };

    value[100].children[50].children[1].children = generateValues(columns, 1);
    rows.children[100].children[50].children[1] = { expanded: true, children: [] };

    value[100].children[50].children[1].children[0].children = generateValues(columns, 1);
    rows.children[100].children[50].children[1].children[0] = { expanded: true, children: [] };
    return (
      <Table
          rows={rows}
          columns={columns}
          value={value}
          rowsPerPage={20}
          defaultRowHeight={50} />
    )
  })
  .add('dynamic table with scrollable rows', () => {
    const columns = generateColumns(8);
    const rows = { totalCount: 1000 };

    const value = generateValues(columns, 1000);
    const loadPage = (page, itemsPerPage) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const pagedValue = value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
          resolve({ totalCount: 1000, value: pagedValue });
        }, 1000)
      });
    };
    return (
      <Table
          rows={rows}
          columns={columns}
          loadPage={loadPage}
          rowsPerPage={20}
          defaultRowHeight={50} />
    )
  });*/