import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import StaticScroller from './Scroller';

const createColumns = count => new Array(count).fill(1).reduce( (acc, item, index) => [...acc, `column${index}`], []);
const createRows = (columns, count) => new Array(count).fill(1).map( (item, rowIndex) => {
  return columns.reduce( (acc, column, columnIndex) => ({ ...acc, [column]: `Value - ${rowIndex} - ${columnIndex}` }), [] );
});

describe.only('StaticScroller', () => {

  it('loads first root page on initial scroll', () => {
    const columns = createColumns(5);
    const value = createRows(columns, 50);
    const child = jest.fn();
    let wrapper;
    act(() => {
      wrapper = shallow((
        <StaticScroller
            defaultColumnWidth={50}
            defaultRowHeight={20}
            rowsPerPage={20}
            columnsPerPage={20}
            value={value}
            scrollTop={10}
            rows={{ totalCount: 50 }}
            columns={{ totalCount: 5 }}>
          {child}
        </StaticScroller>
      ));
    });
    
    expect(child.mock.calls[0][0]).toEqual(value.slice(0, 20));
    const style = wrapper.find('div').prop('style');
    expect(style).toHaveProperty('paddingBottom', 600);
  });

});