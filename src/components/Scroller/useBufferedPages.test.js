import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import useBufferedPages from './useBufferedPages';

const TestComponent = ({
  value,
  page,
  itemsPerPage,
  loadPage,
  totalCount = 0
}) => {
  const visibleValues = useBufferedPages({ value, page, itemsPerPage, loadPage, totalCount });
  return (
    <>
      <div>{typeof visibleValues === 'object' ? JSON.stringify(visibleValues) : visibleValues}</div>
    </>
  );
};

const createValues = count => [...Array(count).keys()];

describe('useBufferedPages', () => {

  describe('sync', () => {

    it('should load initial page 0 and call load page only once', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(1);
      expect(result[0].value[0]).toBe(0);
      expect(result[0].value[19]).toBe(19);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should load 2 pages and call load page 2 times when srolling from page 0 to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 1 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(result[0].value[0]).toBe(0);
      expect(result[1].value[19]).toBe(39);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should load 3 pages when srolling from page 1 to 2', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(result[0].value[0]).toBe(20);
      expect(result[1].value[19]).toBe(59);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should correctly sroll to last page', () => {
      const value = createValues(90);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 4 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(result[0].value.length).toBe(20);
      expect(result[1].value.length).toBe(10);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should reuse cache when scrolling from page 1 to 2 and back to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      wrapper.setProps({ page: 1 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(result[0].value[0]).toBe(0);
      expect(result[1].value[19]).toBe(39);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should use cache and clean it when scrolling forward', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 1 });
      wrapper.setProps({ page: 2 });
      wrapper.setProps({ page: 3 });
      wrapper.setProps({ page: 4 });
      expect(spy).toHaveBeenCalledTimes(5);
    });

  });

  describe('async', () => {

    it('should load initial page 0 and call load page only once', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={100} />); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(1);
      expect(loadPage).toHaveBeenCalledTimes(1);
    });

    it('should load pages 0 and 1 with \'isLoading\' property when current page is 1', () => {
      const loadPage = jest.fn(async () => {});
      const wrapper = shallow(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={100} />);
      const result = JSON.parse(wrapper.find('div').text());
      expect(loadPage).not.toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0].value[0]).toHaveProperty('isLoading', true);
      expect(result[1].value[0]).toHaveProperty('isLoading', true);
    });

    it('should correctly scroll from page 0 to 1', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(loadPage).toHaveBeenCalledTimes(2);
    });

    it('should corrently scroll from page 1 to 2', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('should reuse cache and call loadPage only 3 times when scrolling from page 1 to 2 and back to 1', async () => {
      const loadPage = jest.fn(async () => ({ totalCount: 80, value: [...new Array(20).keys()] }));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(2);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('should reuse and clean cache when scrolling', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => {
        wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={200} />);
      });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 3 }); });
      await act(async () => { wrapper.setProps({ page: 4 }); });
      expect(loadPage).toHaveBeenCalledTimes(5);
    });

  });

});