import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useResize from './useResize';

const TestComponent = ({ startingSizes, preserveAspectRatio }) => {
  const [sizes, setSizes] = useState(startingSizes);
  const onStartResize = useResize({ sizes, onSizesChange: setSizes, preserveAspectRatio });
  return <div style={{ width: sizes.width, height: sizes.height }} onMouseDown={onStartResize} />
};

describe('useResize', () => {

  it('should increase sizes', () => {
    const wrapper = mount(<TestComponent startingSizes={{ width: 50, height: 10 }} />);
    wrapper.find('div').simulate('mousedown', { clientX: 0, clientY: 0 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 10 }));
    });
    wrapper.update();
    expect(wrapper.find('div').prop('style')).toEqual({ width: 70, height: 20 });
  });

  it('should decrease sizes', () => {
    const wrapper = mount(<TestComponent startingSizes={{ width: 100, height: 80 }} />);
    wrapper.find('div').simulate('mousedown', { clientX: 50, clientY: 50 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 40 }));
    });
    wrapper.update();
    expect(wrapper.find('div').prop('style')).toEqual({ width: 80, height: 70 });
  });

  it('should preserve aspect ratio when increasing size and preserveAspectRatio set to true', () => {
    const wrapper = mount(<TestComponent startingSizes={{ width: 100, height: 50 }} preserveAspectRatio />);
    wrapper.find('div').simulate('mousedown', { clientX: 0, clientY: 0 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 0 }));
    });
    wrapper.update();
    expect(wrapper.find('div').prop('style')).toEqual({ width: 150, height: 100 });
  });

  it('should preserve aspect ratio when desreasing size and preserveAspectRatio set to true', () => {
    const wrapper = mount(<TestComponent startingSizes={{ width: 50, height: 100 }} preserveAspectRatio />);
    wrapper.find('div').simulate('mousedown', { clientX: 0, clientY: 0 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: -50 }));
    });
    wrapper.update();
    expect(wrapper.find('div').prop('style')).toEqual({ width: 25, height: 50 });
  });

});