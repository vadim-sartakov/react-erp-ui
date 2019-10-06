import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Scroller from './Scroller';

const TestComponent = props => {
  const rootRef = useRef();
  return (
    <div className="scroller" ref={rootRef}>
      <Scroller {...props} scrollContainerRef={rootRef} />
    </div>
  )
};

describe('Scroller', () => {

  describe('sync', () => {

    it('should call child with correct arguments on initial scroll without meta', () => {
      const children = jest.fn();
      const sourceValue = [{ value: 0 }, { value: 1 }];
      mount((
        <TestComponent
            scroll={0}
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}>
          {children}
        </TestComponent>
      ));
      const { value, meta, gaps } = children.mock.calls[0][0];

      expect(value.length).toBe(1);
      expect(value[0]).toEqual({ index: 0, value: 0 });
      expect(meta).toEqual([]);
      expect(gaps).toEqual({
        start: 0,
        end: 20
      });
    });

    it('should call child with correct arguments on middle-scroll and meta included', () => {
      const children = jest.fn();
      const sourceValue = [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }];
      mount((
        <TestComponent
            scroll={30}
            meta={{ children: [{}, {}, { size: 20 }, {}] }}
            value={sourceValue}
            defaultSize={20}
            itemsPerPage={1}>
          {children}
        </TestComponent>
      ));
      const { value, meta, gaps } = children.mock.calls[0][0];
      expect(value.length).toBe(2);
      expect(value[0]).toEqual({ index: 1, value: 1 });
      expect(value[1]).toEqual({ index: 2, value: 2 });
      expect(meta).toEqual([{ index: 1 }, { index: 2, size: 20 }]);
      expect(gaps).toEqual({
        start: 20,
        end: 20
      });
    });

  });

  describe('async', () => {

    it('should render loading page and then set loaded data', async () => {
      const children = jest.fn();
      const loadPage = jest.fn(async () => [{ value: 0 }, { value: 1 }, { value: 2 }]);
      await act(async () => {
        mount((
          <TestComponent
              scroll={0}
              meta={{ totalCount: 4 }}
              loadPage={loadPage}
              defaultSize={20}
              itemsPerPage={3}>
            {children}
          </TestComponent>
        ));
      });
      const { value: loadingValue } = children.mock.calls[0][0];
      expect(loadingValue.length).toBe(3);
      expect(loadingValue[0].isLoading).toBeTruthy();
      expect(loadingValue[2].isLoading).toBeTruthy();

      const { value } = children.mock.calls[2][0];
      expect(value.length).toBe(3);
      expect(value[0]).toEqual({ index: 0, value: 0 });
      expect(value[2]).toEqual({ index: 2, value: 2 });
    });

  });
    
});