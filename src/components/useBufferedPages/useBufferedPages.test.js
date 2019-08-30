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
      {visibleValues.map((value, index) => {
        return <div key={index}>{value}</div>
      })}
    </>
  );
};

const createValues = count => [...Array(count).keys()];

describe('useBufferedPages', () => {

  describe('sync', () => {

    it('loads initial page 0', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={0} itemsPerPage={20} />);
      const divs = wrapper.find('div');
      expect(divs.length).toBe(20);
      expect(divs.at(0).text()).toBe('0');
      expect(divs.at(19).text()).toBe('19');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('srolls from page 0 to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 1 });
      const divs = wrapper.find('div');
      expect(divs.length).toBe(40);
      expect(divs.at(0).text()).toBe('0');
      expect(divs.at(39).text()).toBe('39');
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('srolls from page 1 to 2', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      const divs = wrapper.find('div');
      expect(divs.length).toBe(40);
      expect(divs.at(0).text()).toBe('20');
      expect(divs.at(39).text()).toBe('59');
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('srolls to last page', () => {
      const value = createValues(90);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 4 });
      const divs = wrapper.find('div');
      expect(divs.length).toBe(30);
      expect(divs.at(0).text()).toBe('60');
      expect(divs.at(29).text()).toBe('89');
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('scrolls from page 1 to 2 and back to 1', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={1} itemsPerPage={20} />);
      wrapper.setProps({ page: 2 });
      wrapper.setProps({ page: 1 });
      const divs = wrapper.find('div');
      expect(divs.length).toBe(40);
      expect(divs.at(0).text()).toBe('0');
      expect(divs.at(39).text()).toBe('39');
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('reusing and cleans cache when scrolling', () => {
      const value = createValues(100);
      const spy = jest.spyOn(value, 'slice');
      const wrapper = shallow(<TestComponent value={value} page={0} itemsPerPage={20} />);
      wrapper.setProps({ page: 1 });
      wrapper.setProps({ page: 2 });
      wrapper.setProps({ page: 3 });
      wrapper.setProps({ page: 4 });
      expect(spy).toHaveBeenCalledTimes(5);
    });

  });

  describe('async', () => {

    it.only('initialy loading 0 and 1 pages', () => {
      const loadPage = jest.fn(async () => {});
      const wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} totalCount={80} />);
      const divs = wrapper.find('div');
      expect(loadPage).not.toHaveBeenCalled();
      expect(divs.length).toBe(80);
      console.log(divs.at(0).text());
      console.log(divs.at(1).text());
      expect(JSON.parse(divs.at(0).text())).toHaveProperty('isLoading', true);
      expect(JSON.parse(divs.at(79).text())).toHaveProperty('isLoading', true);
    });

    it('loads initial page 0', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} />); });
      const divs = wrapper.find('div');
      const firstPage = JSON.parse(divs.at(0).text());
      expect(firstPage.value.length).toBe(20);
      expect(loadPage).toHaveBeenCalledTimes(1);
    });

    it('scrolls from page 0 to 1', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} />); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const divs = wrapper.find('div');
      const firstPage = JSON.parse(divs.at(0).text());
      expect(firstPage.value.length).toBe(20);
      expect(loadPage).toHaveBeenCalledTimes(2);
    });

    it('scrolls from page 1 to 2', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      const divs = wrapper.find('div');
      const firstPage = JSON.parse(divs.at(0).text());
      expect(firstPage.value.length).toBe(20);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('scrolls from page 1 to 2 and back to 1', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => { wrapper = mount(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} />); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      const divs = wrapper.find('div');
      const firstPage = JSON.parse(divs.at(0).text());
      expect(firstPage.value.length).toBe(20);
      expect(loadPage).toHaveBeenCalledTimes(3);
    });

    it('reuses and cleans cache when scrolling', async () => {
      const loadPage = jest.fn(async () => new Array(20));
      let wrapper;
      await act(async () => {
        wrapper = mount(<TestComponent loadPage={loadPage} page={0} itemsPerPage={20} />);
      });
      await act(async () => { wrapper.setProps({ page: 1 }); });
      await act(async () => { wrapper.setProps({ page: 2 }); });
      await act(async () => { wrapper.setProps({ page: 3 }); });
      await act(async () => { wrapper.setProps({ page: 4 }); });
      expect(loadPage).toHaveBeenCalledTimes(5);
    });

  });

});