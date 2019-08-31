import React from 'react';
import { ScrollerTree } from '../../components';

const rowsMeta = {
  totalCount: 1000
};

const columnsMeta = {
  totalCount: 1000
};

const exampleValue = [

];

const TestTable = ({
  rows,
  columns,
  value
}) => {
  return (
    // This is important for Chrome
    <div style={{ overflowAnchor: 'none' }}>
      <table>
        <thead>
          <ScrollerTree
              value={columns}
              meta={columns}
              renderGap={width => <th style={{ width }} />}>
            {({ value: columnValue, meta: columnMeta, depth }) => (
              <th>
                {columnValue.title}
              </th>
            )}
          </ScrollerTree>
        </thead>
        <tbody>
          <ScrollerTree
              value={value}
              meta={rows}
              renderGap={height => <tr style={{ height }} />}>
            {({ value: rowValue, meta: rowMeta, depth }) => (
              <tr>
                <ScrollerTree
                    value={rowValue}
                    meta={columns}
                    renderGap={width => <td style={{ width }} />}>
                  {({ value: columnValue, meta: columnMeta, depth }) => (
                    <td>
                      {columnValue.value}
                    </td>
                  )}
                </ScrollerTree>
              </tr>
            )}
          </ScrollerTree>
        </tbody>
      </table>
    </div>
  )
};

export default TestTable;