import React from 'react';
import { shallow } from 'enzyme';

const rows = [
  {
    height: 10,
    expanded: true,
    children: [
      // ...
    ]
  },
  // ...
];

const columns = [
  {
    width: 20,
    expanded: true,
    children: [
      // ...
    ]
  },
  // ...
];

const data = [
  {
    columns: [
      {
        value: 'Some value',
        format: 'Some format',
        text: 'Some text',
        children: [
          // ...
        ]
      },
      // ...
      {
        colspan: 2
      }
    ],
  },

  {
    columns: [
      //...
    ],
    children: [
      // ...
    ]
  }
];

const gaps = {
  top: 10,
  bottom: 20,
  left: 10,
  right: 40,
  children: [
    // ...
  ]
}

// Apply visible pages to rows and columns.
// Than render as usual
const render = (rows, columns, gaps) => {
  return (
    <table>
      <tbody>
        {rows.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => {
                const cell = data[rowIndex][columnIndex];
                return (
                  <td>
                    {cell.text}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
};

describe('StaticScroller', () => {
  
  it('reners', () => {

  });

});