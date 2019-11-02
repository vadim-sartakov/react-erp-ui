import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import {
  gridValue,
  syncListWithDefaultSizes,
  asyncLazyListWithDefaultSizes,
  syncGridWithDefaultSizes,
  syncGridWithCustomSizes,
  asyncGridWithDefaultSizes,
  asyncGridWithCustomSizes,
  syncGridWithDefaultSizesAndFixedRowsColumns
} from './Scroller.stories';
import { loadPage } from './utils';

export const loadRowsPageSync = value => (page, itemsPerPage) => loadPage(value, page, itemsPerPage);
export const loadRowsPageAsync = value => async (page, itemsPerPage) => loadPage(value, page, itemsPerPage);

describe('Scroller', () => {

  describe('list', () => {

    it('should load first rows pages with default sizes', () => {
      const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
      const wrapper = mount(syncListWithDefaultSizes({ loadRowsPage }));
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('div.pages').prop('style').top).toBe(0);
      expect(wrapper.find('div.row').first().text()).toBe("Value 0");
      expect(wrapper.find('div.row').last().text()).toBe("Value 59");
    });

    it('should load first rows pages without full height when list is lazy', async () => {
      const loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
      let wrapper;
      await act(async () => { wrapper = mount(asyncLazyListWithDefaultSizes({ loadRowsPage })) });
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(2400);
      expect(wrapper.find('div.pages').prop('style').top).toBe(0);
      expect(wrapper.find('div.row').first().text()).toBe("Value 0");
      expect(wrapper.find('div.row').last().text()).toBe("Value 59");
    });

  });

  describe('grid', () => {

    const checkDefaultSizesFirstPage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('div.pages').prop('style').top).toBe(0);
      expect(wrapper.find('div.pages').prop('style').left).toBe(0);
    };

    const checkDefaultSizesMiddlePage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('div.pages').prop('style').top).toBe(1200);
      expect(wrapper.find('div.pages').prop('style').left).toBe(1500);
    };

    const checkDefaultSizesLastPage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(40);
      expect(wrapper.find('div.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('div.pages').prop('style').top).toBe(38400);
      expect(wrapper.find('div.pages').prop('style').left).toBe(4500);
    };

    const checkCustomSizesFirstPage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('div.pages').prop('style').top).toBe(0);
      expect(wrapper.find('div.pages').prop('style').left).toBe(0);
    };

    const checkCustomSizesMiddlePage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(60);
      expect(wrapper.find('div.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('div.pages').prop('style').top).toBe(1800);
      expect(wrapper.find('div.pages').prop('style').left).toBe(1800);
    };

    const checkCustomSizesLastPage = (wrapper) => {
      expect(wrapper.find('div.row').length).toBe(40);
      expect(wrapper.find('div.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('div.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('div.pages').prop('style').top).toBe(57600);
      expect(wrapper.find('div.pages').prop('style').left).toBe(5400);
    };

    describe('sync', () => {

      it('should load first rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithDefaultSizes({ loadRowsPage }));
        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } })
        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

      it('should load last rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } })
        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

      it('should load first rows and columns pages with custom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithCustomSizes({ loadRowsPage }));
        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with custom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } })
        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

      it('should load last rows and columns pages with custom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } })
        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

    });

    describe('async', () => {

      it('should load first rows and columns pages with default sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage }));

        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage })) });

        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with default sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } });

        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } }) });
        wrapper.update();

        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with default sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } });

        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } }) });
        wrapper.update();

        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

      it('should load first rows and columns pages with custom sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage }));

        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage })) });

        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with custom sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } });

        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } }) });
        wrapper.update();

        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with custom sizes', async () => {
        let loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        let wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } });

        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('div.cell').last().text()).toBe("Loading...");

        loadRowsPage = jest.fn(loadRowsPageAsync(gridValue));
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } }) });
        wrapper.update();

        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

    });

    describe('fixed rows, columns', () => {

      it('should load first rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithDefaultSizesAndFixedRowsColumns({ loadRowsPage }));
        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 59 - 19");
      });

      it('should load middle rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync(gridValue));
        const wrapper = mount(syncGridWithDefaultSizesAndFixedRowsColumns({ loadRowsPage }));
        wrapper.find('div.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } })
        expect(wrapper.find('div.row').length).toBe(62);
        expect(wrapper.find('div.cover').prop('style').height).toBe(40000);
        expect(wrapper.find('div.cover').prop('style').width).toBe(7500);
        expect(wrapper.find('div.pages').prop('style').top).toBe(1120);
        expect(wrapper.find('div.pages').prop('style').left).toBe(1200);
        expect(wrapper.find('div.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('div.cell').last().text()).toBe("Value 89 - 29");
      });

    });

  });

});