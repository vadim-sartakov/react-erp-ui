import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import {
  gridValue,
  syncGridWithDefaultSizes,
  syncGridWithCustomSizes,
  asyncGridWithDefaultSizes,
  asyncGridWithCustomSizes
} from './useScroller.stories';
import { loadPage } from './utils';

export const loadRowsPageSync = (page, itemsPerPage) => loadPage(gridValue, page, itemsPerPage);
export const loadRowsPageAsync = async (page, itemsPerPage) => loadPage(gridValue, page, itemsPerPage);

describe('useScroller', () => {

  describe('grid', () => {

    const checkDefaultSizesFirstPage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(60);
      expect(wrapper.find('.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('.pages').prop('style').top).toBe(0);
      expect(wrapper.find('.pages').prop('style').left).toBe(0);
    };

    const checkDefaultSizesMiddlePage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(60);
      expect(wrapper.find('.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('.pages').prop('style').top).toBe(1200);
      expect(wrapper.find('.pages').prop('style').left).toBe(1500);
    };

    const checkDefaultSizesLastPage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(40);
      expect(wrapper.find('.cover').prop('style').height).toBe(40000);
      expect(wrapper.find('.cover').prop('style').width).toBe(7500);
      expect(wrapper.find('.pages').prop('style').top).toBe(38400);
      expect(wrapper.find('.pages').prop('style').left).toBe(4500);
    };

    const checkCustomSizesFirstPage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(60);
      expect(wrapper.find('.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('.pages').prop('style').top).toBe(0);
      expect(wrapper.find('.pages').prop('style').left).toBe(0);
    };

    const checkCustomSizesMiddlePage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(60);
      expect(wrapper.find('.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('.pages').prop('style').top).toBe(1800);
      expect(wrapper.find('.pages').prop('style').left).toBe(1800);
    };

    const checkCustomSizesLastPage = (wrapper) => {
      expect(wrapper.find('.row').length).toBe(40);
      expect(wrapper.find('.cover').prop('style').height).toBe(60000);
      expect(wrapper.find('.cover').prop('style').width).toBe(9000);
      expect(wrapper.find('.pages').prop('style').top).toBe(57600);
      expect(wrapper.find('.pages').prop('style').left).toBe(5400);
    };

    describe('sync', () => {

      it('should load first rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithDefaultSizes({ loadRowsPage }));
        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } })
        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with default sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } })
        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

      it('should load first rows and columns pages with custom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithCustomSizes({ loadRowsPage }));
        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('.cell').last().text()).toBe("Value 59 - 19");
        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with custom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } })
        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('.cell').last().text()).toBe("Value 89 - 29");
        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with cusrom sizes', () => {
        const loadRowsPage = jest.fn(loadRowsPageSync);
        const wrapper = shallow(syncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } })
        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('.cell').last().text()).toBe("Value 999 - 49");
        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

    });

    describe('async', () => {

      it('should load first rows and columns pages with default sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithDefaultSizes({ loadRowsPage }));

        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => {
          wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage }));
        });

        checkDefaultSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('.cell').last().text()).toBe("Value 59 - 19");

        expect(loadRowsPage).toHaveBeenCalledTimes(2);

      });

      it('should load middle rows and columns pages with default sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } });

        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 1800, scrollLeft: 2250 } }) });
        wrapper.update();

        checkDefaultSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('.cell').last().text()).toBe("Value 89 - 29");

        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with default sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithDefaultSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } });

        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => { wrapper = mount(asyncGridWithDefaultSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 40000, scrollLeft: 7500 } }) });
        wrapper.update();

        checkDefaultSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('.cell').last().text()).toBe("Value 999 - 49");

        expect(loadRowsPage).toHaveBeenCalledTimes(4);

      });

      it('should load first rows and columns pages with custom sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithCustomSizes({ loadRowsPage }));

        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => {
          wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage }));
        });

        checkCustomSizesFirstPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 0 - 0");
        expect(wrapper.find('.cell').last().text()).toBe("Value 59 - 19");

        expect(loadRowsPage).toHaveBeenCalledTimes(2);
      });

      it('should load middle rows and columns pages with custom sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } });

        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 3600, scrollLeft: 3600 } }) });
        wrapper.update();

        checkCustomSizesMiddlePage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 30 - 10");
        expect(wrapper.find('.cell').last().text()).toBe("Value 89 - 29");

        expect(loadRowsPage).toHaveBeenCalledTimes(3);
      });

      it('should load last rows and columns pages with cusrom sizes', async () => {
        const loadRowsPage = jest.fn(loadRowsPageAsync);
        let wrapper = shallow(asyncGridWithCustomSizes({ loadRowsPage }));
        wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } });

        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Loading...");
        expect(wrapper.find('.cell').last().text()).toBe("Loading...");
        
        expect(loadRowsPage).toHaveBeenCalledTimes(0);
        await act(async () => { wrapper = mount(asyncGridWithCustomSizes({ loadRowsPage })) });
        await act(async () => { wrapper.find('.scroller-container').simulate('scroll', { target: { scrollTop: 59000, scrollLeft: 8000 } }) });
        wrapper.update();

        checkCustomSizesLastPage(wrapper);
        expect(wrapper.find('.cell').first().text()).toBe("Value 960 - 30");
        expect(wrapper.find('.cell').last().text()).toBe("Value 999 - 49");

        expect(loadRowsPage).toHaveBeenCalledTimes(4);
      });

    });

  });

});