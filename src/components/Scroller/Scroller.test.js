import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import {
  gridValue,
  listValue,
  syncListWithDefaultSizes,
  asyncLazyListWithDefaultSizes,
  syncGridWithDefaultSizes,
  syncGridWithCustomSizes,
  asyncGridWithDefaultSizes,
  asyncGridWithCustomSizes,
  syncGridWithDefaultSizesAndFixedRowsColumns
} from './Scroller.stories';
import { loadPage } from './utils';
import Scroller from './Scroller';

export const loadPageAsync = value => async (page, itemsPerPage) => loadPage(value, page, itemsPerPage);

describe('Scroller', () => {

  const mapper = json => {
    if (json.type === 'Scroller' || json.type === 'ScrollerContainer') {
      return {
        ...json,
        props: {
          ...json.props,
          value: json.props.value && `length: ${json.props.value.length}`,
          rows: json.props.rows && `length: ${json.props.rows.length}`,
          columns: json.props.columns && `length: ${json.props.columns.length}`
        }
      }
    }
    if (json.type === 'ScrollerCell') {
      return {
        ...json,
        props: {
          ...json.props,
          style: undefined
        }
      }
    }
    return json;
  };

  describe('list', () => {

    it('should load first rows pages with default sizes', () => {
      const wrapper = mount(syncListWithDefaultSizes());
      expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
    });

    it('should load first rows pages without full height when list is lazy', async () => {
      const loadPage = jest.fn(loadPageAsync(listValue));
      let wrapper;
      await act(async () => { wrapper = mount(asyncLazyListWithDefaultSizes({ loadPage })) });
      wrapper.update();
      expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
    });

  });
  describe('grid', () => {

    describe('sync', () => {

      const defaultWrapper = mount(syncGridWithDefaultSizes());
      const customWrapper = mount(syncGridWithCustomSizes());

      it('should load first rows and columns pages with default sizes', () => {
        const wrapper = defaultWrapper;
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load middle rows and columns pages with default sizes', () => {
        const wrapper = defaultWrapper;
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } })
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load last rows and columns pages with default sizes', () => {
        const wrapper = defaultWrapper;
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } })
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load first rows and columns pages with custom sizes', () => {
        const wrapper = customWrapper;
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load middle rows and columns pages with custom sizes', () => {
        const wrapper = customWrapper;
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } })
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load last rows and columns pages with custom sizes', () => {
        const wrapper = customWrapper;
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } })
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

    });

    describe('async', () => {

      it('should load first rows and columns pages with default sizes', async () => {
        let loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper;
        
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadPage })); });
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();

        wrapper.update();
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();

        expect(loadPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with default sizes', async () => {
        let loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper = mount(asyncGridWithDefaultSizes({ loadPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } });

        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();

        loadPage = jest.fn(loadPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } }) });
        wrapper.update();

        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
        expect(loadPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with default sizes', async () => {
        const loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper;
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } }) });
        wrapper.update();
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
        expect(loadPage).toHaveBeenCalledTimes(4);
      });

      it('should load first rows and columns pages with custom sizes', async () => {
        const loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper;
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadPage })) });
        wrapper.update();
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
        expect(loadPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with custom sizes', async () => {
        const loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper;
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } }) });
        wrapper.update();
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
        expect(loadPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with custom sizes', async () => {
        const loadPage = jest.fn(loadPageAsync(gridValue));
        let wrapper;
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } }) });
        wrapper.update();
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
        expect(loadPage).toHaveBeenCalledTimes(4);
      });

    });

    describe('fixed rows, columns', () => {

      it('should load first rows and columns pages with default sizes', () => {
        const wrapper = mount(syncGridWithDefaultSizesAndFixedRowsColumns());
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

      it('should load middle rows and columns pages with default sizes', () => {
        const wrapper = mount(syncGridWithDefaultSizesAndFixedRowsColumns());
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } })
        expect(toJSON(wrapper.find(Scroller), { map: mapper })).toMatchSnapshot();
      });

    });

  });

});