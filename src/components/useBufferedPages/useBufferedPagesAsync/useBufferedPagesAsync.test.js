import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import useBufferedPagesAsync from './useBufferedPagesAsync';

const TestComponent = ({
  page,
  itemsPerPage,
  loadPage
}) => {
  const visiblePages = useBufferedPagesAsync(page, itemsPerPage, loadPage);
  return (
    <>
      {visiblePages.map((value, index) => <div key={index}>{JSON.stringify(value)}</div>)}
    </>
  );
};

describe('useBufferedPagesSync', () => {
  
  it('initialy loading 0 and 1 pages', () => {
    const loadPage = jest.fn(async () => {});
    const wrapper = shallow(<TestComponent loadPage={loadPage} page={1} itemsPerPage={20} />);
    const divs = wrapper.find('div');
    const firstPage = JSON.parse(divs.at(0).text());
    const secondPage = JSON.parse(divs.at(1).text());
    expect(firstPage).toHaveProperty('isLoading', true);
    expect(secondPage).toHaveProperty('isLoading', true);
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