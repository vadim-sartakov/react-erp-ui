import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import StaticScroller from './Scroller';

const createColumns = count => new Array(count).fill(1).reduce( (acc, item, index) => [...acc, `column${index}`], []);
const createRows = (columns, count) => new Array(count).fill(1).map( (item, rowIndex) => {
  return columns.reduce( (acc, column, columnIndex) => ({ ...acc, [column]: `Value - ${rowIndex} - ${columnIndex}` }), [] );
});

describe('StaticScroller', () => {

  it('loads first root page on initial scroll', () => {
    const columns = createColumns(5);
    const value = createRows(columns, 50);
    const child = jest.fn();
    act(() => {
      shallow((
        <StaticScroller
            defaultColumnWidth={50}
            defaultRowHeight={20}
            rowsPerPage={20}
            columnsPerPage={20}
            value={value}>
          {child}
        </StaticScroller>
      ));
    });
    expect(child.mock.calls[0][0]).toEqual(value.slice(0, 20));
    expect(child.mock.calls[0][1]).toEqual({ top: 0, bottom: 600, left: 0, right: 0 });
  });

  it('loads first and second root page on scroll', () => {
    const columns = createColumns(5);
    const value = createRows(columns, 50);
    const child = jest.fn();
    act(() => {
      shallow((
        <StaticScroller
            defaultColumnWidth={50}
            defaultRowHeight={20}
            rowsPerPage={20}
            columnsPerPage={20}
            scrollTop={300}
            value={value}>
          {child}
        </StaticScroller>
      ));
    });
    expect(child.mock.calls[0][0]).toEqual(value.slice(0, 40));
    expect(child.mock.calls[0][1]).toEqual({ top: 0, bottom: 200, left: 0, right: 0 });
  });

  it('loads root last page', () => {
    const columns = createColumns(5);
    const value = createRows(columns, 50);
    const child = jest.fn();
    act(() => {
      shallow((
        <StaticScroller
            defaultColumnWidth={50}
            defaultRowHeight={20}
            rowsPerPage={20}
            columnsPerPage={20}
            scrollTop={600}
            value={value}>
          {child}
        </StaticScroller>
      ));
    });
    expect(child.mock.calls[0][0]).toEqual(value.slice(20, 50));
    expect(child.mock.calls[0][1]).toEqual({ top: 400, bottom: 0, left: 0, right: 0 });
  });

  it('scrolls and calculates values and paddings', () => {
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
            scrollTop={0}
            value={value}>
          {child}
        </StaticScroller>
      ));
    });
    act(() => {
      wrapper.find('div').simulate('scroll', { scrollTop: 600, scrollLeft: 0 });
    });
    expect(child.mock.calls[1][0]).toEqual(value.slice(20, 50));
    expect(child.mock.calls[1][1]).toEqual({ top: 400, bottom: 0, left: 0, right: 0 });
  });

});