import React from 'react';
import { mount } from 'enzyme';
import ScrollerTree from './ScrollerTree';

describe('ScrollTree', () => {

  describe('sync', () => {

    it('should correctly render flat value without meta', () => {
      const value = [0, 1, 2];
      const children = jest.fn();
      const renderGap = jest.fn();
      mount((
        <ScrollerTree
            scroll={0}
            defaultSize={20}
            itemsPerPage={2}
            renderGap={renderGap}
            value={value}>
          {children}
        </ScrollerTree>
      ));
      expect(children).toHaveBeenCalledTimes(2);
      expect(children.mock.calls[0][0]).toEqual({ index: 0, depth: 0, value: 0 });
      expect(children.mock.calls[1][0]).toEqual({ index: 1, depth: 0, value: 1 });
      
      expect(renderGap).toHaveBeenCalledTimes(1);
      expect(renderGap.mock.calls[0][0]).toEqual(20);
    });

    it('should correctly render flat value with meta', () => {
      const value = [0, 1, 2];
      const children = jest.fn();
      const renderGap = jest.fn();
      mount((
        <ScrollerTree
            scroll={0}
            meta={{ children: [{ size: 20 }] }}
            defaultSize={20}
            itemsPerPage={2}
            renderGap={renderGap}
            value={value}>
          {children}
        </ScrollerTree>
      ));
      expect(children).toHaveBeenCalledTimes(2);
      expect(children.mock.calls[0][0]).toEqual({ index: 0, depth: 0, value: 0, meta: { size: 20 } });
      expect(children.mock.calls[1][0]).toEqual({ index: 1, depth: 0, value: 1 });
      
      expect(renderGap).toHaveBeenCalledTimes(1);
      expect(renderGap.mock.calls[0][0]).toEqual(20);
    });

    it('should not render nested values when item is not expanded', () => {
      const value = [{ value: 0 }, { value: 1, children: [{ value: 0 }] }, { value: 2 }];
      const children = jest.fn();
      const renderGap = jest.fn();
      mount((
        <ScrollerTree
            scroll={0}
            defaultSize={20}
            itemsPerPage={2}
            renderGap={renderGap}
            value={value}>
          {children}
        </ScrollerTree>
      ));
      expect(children).toHaveBeenCalledTimes(2);
      expect(children.mock.calls[0][0]).toEqual({ index: 0, depth: 0, value: { value: 0 } });
      expect(children.mock.calls[1][0]).toEqual({ index: 1, depth: 0, meta: { totalCount: 1 }, value: { value: 1, children: [{ value: 0 }] } });
      
      expect(renderGap).toHaveBeenCalledTimes(1);
      expect(renderGap.mock.calls[0][0]).toEqual(20);
    });

    it('should correctly render nested values when expanded', () => {
      const value = [{ value: 0 }, { value: 1, children: [{ value: 0 }] }, { value: 2 }];
      const children = jest.fn();
      const renderGap = jest.fn();
      mount((
        <ScrollerTree
            scroll={0}
            meta={{ totalCount: 3, children: [{}, { totalCount: 1, expanded: true }] }}
            defaultSize={20}
            itemsPerPage={2}
            renderGap={renderGap}
            value={value}>
          {children}
        </ScrollerTree>
      ));
      expect(children).toHaveBeenCalledTimes(3);
      expect(children.mock.calls[0][0]).toEqual({ index: 0, depth: 0, value: { value: 0 }, meta: {} });
      expect(children.mock.calls[1][0]).toEqual({ index: 1, depth: 0, isGroup: true, meta: { totalCount: 1, expanded: true }, value: { value: 1, children: [{ value: 0 }] } });
      expect(children.mock.calls[2][0]).toEqual({ index: 0, depth: 1, value: { value: 0 } });
      
      expect(renderGap).toHaveBeenCalledTimes(1);
      expect(renderGap.mock.calls[0][0]).toEqual(20);
    });

  });

});