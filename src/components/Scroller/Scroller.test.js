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

describe('StaticScroller', () => {

  describe('with default sizes', () => {

    it('initial scroll', () => {
      const children = jest.fn();
      const sourceValue = [{}, {}];
      mount((
        <TestComponent
            scroll={0}
            meta={{ totalCount: 2 }}
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}>
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

    it('page 2', () => {
      const children = jest.fn();
      const sourceValue = [{}, {}, {}, {}];
      mount((
        <TestComponent
            scroll={40}
            meta={{ totalCount: 4 }}
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}>
          {children}
        </TestComponent>
      ));
      const { value, meta, gaps } = children.mock.calls[0][0];

      expect(value.length).toBe(2);
      expect(meta).toEqual([]);
      expect(gaps).toEqual({
        start: 20,
        end: 20
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