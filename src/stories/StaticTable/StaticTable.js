import React from 'react';
import { StaticScroller, StaticScrollerItems } from '../../components';

const exampleRowsMeta = {
  totalCount: 10,
  paddings: { start: 10, end: 20 },
  children: [
    {

    }
  ]
};

// Second column expanded
// Third row expanded
const exampleValue = [ // Rows
  { //Row 0
    columns: [ // Columns
      { // Column 0 (Cell 0-0)
        value: 'Value 0 - 0'
      },
      { // Column 1 (Cell 0-1)
        value: 'Value 0 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 0-1-0)
            value: 'Value 0 - 1 - 0'
          },
          { // Column 1 (Cell 0-1-1)
            value: 'Value 0 - 1 - 1'
          }
        ]
      }
    ]
  },
  { // Row 1
    columns: [ // Columns
      { // Column 0 (Cell 1-0)
        value: 'Value 1 - 0'
      },
      { // Column 1 (Cell 1-1)
        value: 'Value 1 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 1-1-0)
            value: 'Value 1 - 1 - 0'
          },
          { // Column 1 (Cell 1-1-1)
            value: 'Value 1 - 1 - 1'
          }
        ]
      }
    ]
  },
  { //Row 2
    columns: [ // Columns
      { // Column 0 (Cell 2-0)
        value: 'Value 2 - 0'
      },
      { // Column 0 (Cell 2-1)
        value: 'Value 2 - 1',
        children: [ // Expanded columns
          { // Column 0 (Cell 2-1-0)
            value: 'Value 2 - 1 - 0'
          },
          { // Column 1 (Cell 2-1-1)
            value: 'Value 2 - 1 - 1'
          }
        ]
      }
    ],
    children: [
      {
        columns: [
          // ... the same column structure as for previous rows
        ]
      }
    ]
  },
];

const StaticTable = ({ value }) => {
  return (
    <StaticScroller value={value}>
      {/* already visible meta and value */}
      {({ rowsMeta, columnsMeta, rootStyle, value }) => {
        return (
          <table style={rootStyle}>
            <thead>
              {/* Should accept only meta prop */}
              <StaticScrollerItems
                  meta={columnsMeta}
                  renderPadding={size => <td style={{ width: size }} />}>
                {({ meta: columnMeta, depth: columnDepth }) => {
                  return <th>{value.title}</th>
                }}
              </StaticScrollerItems>
            </thead>
            <tbody>
              <StaticScrollerItems
                  meta={rowsMeta}
                  value={value}
                  renderPadding={size => <tr style={{ height: size }} />}>
                {({ value: rowValue, meta: rowMeta, depth: rowDepth }) => {
                  return (
                    <tr>
                      <StaticScrollerItems
                          meta={columnsMeta}
                          value={rowValue.columns}
                          renderPadding={size => <td style={{ width: size }} />}>
                        {({ value: columnValue, meta: columnMeta, depth: columnDepth }) => {
                          // Loading items should appear when dynamic scrolling is involved with loadPage prop instead of static value
                          return rowValue.isLoading ? <td>Loading...</td> : <td>{columnValue}</td>
                        }}
                      </StaticScrollerItems>
                    </tr>
                  )
                }}
              </StaticScrollerItems>
            </tbody>
          </table>
        )
      }}
    </StaticScroller>
  )
};

export default StaticTable;