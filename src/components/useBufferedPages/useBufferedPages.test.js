import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import useBufferedPages from './useBufferedPages';

const TestComponent = ({
  value,
  page,
  itemsPerPage,
  loadPage,
  totalCount
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

    it('loads initial page 0', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(20);
      expect(result[0]).toBe(0);
      expect(result[19]).toBe(19);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('srolls from page 0 to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 1 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(result[0]).toBe(0);
      expect(result[39]).toBe(39);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('srolls from page 1 to 2', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(result[0]).toBe(20);
      expect(result[39]).toBe(59);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('srolls to last page', () => {
      const value = createValues(90);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 4 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(30);
      expect(result[0]).toBe(60);
      expect(result[29]).toBe(89);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('scrolls from page 1 to 2 and back to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = mount(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      wrapper.setProps({ page: 1 });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(result[0]).toBe(0);
      expect(result[39]).toBe(39);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('reusing and cleans cache when scrolling', () => {
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

    it('initialy loading 0 and 1 pages', () => {
      const loadPage = jest.fn(async () => {});
      const wrapper = shallow(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />);
      const result = JSON.parse(wrapper.find('div').text());
      expect(loadPage).not.toHaveBeenCalled();
      expect(result.length).toBe(40);
      expect(result[0]).toHaveProperty('isLoading', true);
      expect(result[1]).toHaveProperty('isLoading', true);
    });

    it('loads initial page 0', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={80} />); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(20);
      expect(loadPage).toHaveBeenCalledTimes(1);
    });

    it('scrolls from page 0 to 1', async () => {
      const loadPage = jest.fn(async () => [...new Array(20).keys()]);
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(loadPage).toHaveBeenCalledTimes(2);
    });

    it('scrolls from page 1 to 2', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('scrolls from page 1 to 2 and back to 1', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const result = JSON.parse(wrapper.find('div').text());
      expect(result.length).toBe(40);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('reuses and cleans cache when scrolling', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => {
        wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} totalCount={80} />);
      });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 3 }); });
      await act(async () => { wrapper.setProps({ page: 4 }); });
      expect(loadPage).toHaveBeenCalledTimes(5);
    });

  });

});