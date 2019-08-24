import React from 'react';
import { shallow } from 'enzyme';

describe('Scroller', () => {

  it('renders root first page on initial scroll = 0', () => {

    const wrapper = shallow();
    const result = 0;
    expect(result).toBe({
      columns: [0],
      rows: [0]
    })

  });

  it('renders root first and second pages when scrolled half of first page', () => {

    const scrollTop = 50;
    const wrapper = shallow();
    const rowsMeta = {
      // Maybe if there is no way to restore server-backed table structure, this property is redundant?
      childrenCount: 64,
      children: [
        {
          height: 20, // or default
          childrenCount: 20
        },
        {
          height: 20,
        }
      ]
    };
    const result = 0;
    expect(result).toBe({
      columns: [0],
      rows: [0, 1]
    })

  });

  it('renders child and root first pages', () => {

    const scrollTop = 50;
    const wrapper = shallow();
    const rowsMeta = {
      childrenCount: 64,
      children: [
        {
          height: 20,
          childrenCount: 20,
          children: [
            // ...
            {
              height: 20
            }
          ]
        },
        {
          height: 20,
          expanded: true
        }
      ]
    };
    const result = 0;
    expect(result).toBe({
      columns: [0],
      rows: [0, [0], 1]
    })

  });

});