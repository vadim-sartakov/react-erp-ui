import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Scroller from './Scroller';

const TestComponent = props => {
  const rootRef = useRef();
  return (
    <div className="scroller" ref={rootRef}>
      <Scroller {...props} scrollContainerRef={rootRef} />
    </div>
  )
};

describe.skip('StaticScroller', () => {

  describe('with default sizes', () => {

    it('renders page 0 and end gap on initial scroll', () => {
      const children = jest.fn();
      const sourceValue = [{}, {}];
      mount((
        <TestComponent
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}
            scrollDirection="vertical">
          {children}
        </TestComponent>
      ));
      const { value, meta, gaps } = children.mock.calls[0][0];

      expect(value.length).toBe(1);
      expect(meta).toEqual([]);
      expect(gaps).toEqual({
        start: 0,
        end: 20
      });
    });

    it('renders page 1 and 2 with start and end gaps on non-zero scroll', () => {
      const children = jest.fn();
      const sourceValue = [{}, {}, {}, {}];
      const wrapper = mount((
        <TestComponent
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}
            scrollDirection="vertical">
          {children}
        </TestComponent>
      ));
      act(() => {
        const event = new Event('scroll');
        Object.defineProperty(event, 'target', { value: { scrollTop: 40 } });
        wrapper.find('.scroller').instance().dispatchEvent(event);
      });
      const { value, meta, gaps } = children.mock.calls[1][0];

      expect(value.length).toBe(2);
      expect(meta).toEqual([]);
      expect(gaps).toEqual({
        start: 20,
        end: 20
      });
    });

    it('renders page 0 and 1 with end gap on related scroll', () => {
      const children = jest.fn();
      const sourceValue = [{}, {}, {}, {}];
      const wrapper = mount((
        <TestComponent
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}
            relativeScroll={100}
            scrollDirection="vertical">
          {children}
        </TestComponent>
      ));
      act(() => {
        const event = new Event('scroll');
        Object.defineProperty(event, 'target', { value: { scrollTop: 120 } });
        wrapper.find('.scroller').instance().dispatchEvent(event);
      });
      const { value, meta, gaps } = children.mock.calls[1][0];

      expect(value.length).toBe(2);
      expect(meta).toEqual([]);
      expect(gaps).toEqual({
        start: 0,
        end: 40
      });
    });

  });

  describe.skip('with specific sizes', () => {

    it('renders page 0 and end paddings with initial scroll, specific sizes and flat source objects', () => {
      const children = jest.fn();
      const rowHeights = [
        { size: 10 },
        { size: 20 }
      ];
      const columnsWidths = [
        { size: 80 },
        { size: 100 }
      ];
      shallow((
        <Scroller
            rowHeights={rowHeights}
            columnsWidths={columnsWidths}
            rowsPerPage={1}
            columnsPerPage={1}>
          {children}
        </Scroller>
      ));
      expect(children).toBeCalledTimes(1);
      const { rowsMeta, columnsMeta, rootStyle } = children.calls[0][0];
      expect(rowsMeta).toEqual({
        page: 0,
        children: [
          { size: 10 },
          { size: 20 }
        ]
      });
      expect(columnsMeta).toEqual({
        page: 0,
        children: [
          { size: 80 },
          { size: 100 }
        ]
      });
      expect(rootStyle).toEqual({
        marginLeft: -20,
        merginBottom: 20
      });
    });

  });

  describe.skip('mixed specific sizes and default sizes', () => {

  });
    
});