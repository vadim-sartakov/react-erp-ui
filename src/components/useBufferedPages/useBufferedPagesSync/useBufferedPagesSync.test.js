import React from 'react';
import { shallow } from 'enzyme';
import useBufferedPagesSync from './useBufferedPagesSync';

const TestComponent = ({
  value,
  page,
  itemsPerPage
}) => {
  const visibleValues = useBufferedPagesSync(value, page, itemsPerPage);
  return (
    <>
      {visibleValues.map((value, index) => <div key={index}>{value}</div>)}
    </>
  );
};

const createValues = count => [...Array(count).keys()];

describe('useBufferedPagesSync', () => {
  
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