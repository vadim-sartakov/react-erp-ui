import React, { useRef, useState, useEffect } from 'react';
import { shallow } from 'enzyme';

const rows = {
  gaps: {
    start: 20,
    end: 50
  },
  page: 5,
  rows: [ // Already shrinked visible rows meta
    {
      height: 10,
      expanded: true,
      gaps: {/* ... */},
      rows: [
        // ...
      ]
    }
  ]
  // ...
};

const columns = {
  gaps: {
    start: 10,
    end: 20
  },
  columns: [
    {
      width: 20,
      expanded: true,
      gaps: {/* ... */},
      columns: [
        // ...
      ]
    }
  ]
  // ...
};

const value = [
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
    rows: [
      // ...
    ]
  }
];

/*
Apply visible pages to rows and columns.
Than render as usual

 rows and columns here should be shrinked metas
 combine it with data makes no sense.

 We have 2 options:
- Combine meta and data.
- Separate meta and data. Seems to be cleaner approach.

How to structure gaps???????????????????????????????????????????????
Shouldn't we combine it with meta?

I think combining gaps and meta would be a bit cleaner approach !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Should component process the data??????????????????????????????????????????????
Should it shrink according to visible pages or leave it to the client?

Or we should combine result whole thing into one object?

*/

describe.skip('StaticScroller', () => {
  
  it('reners', () => {

  });

});