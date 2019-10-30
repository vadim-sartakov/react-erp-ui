import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import useClickAway from './useClickAway';

const TestComponent = ({ onClickAway }) => {
  const rootRef = useRef();
  useClickAway(rootRef, onClickAway);
  return (
    <>
      <div className="root-item" ref={rootRef}>
        <div className="nested-item" />
      </div>
      <div className="outside-item" />
    </>
  )
};

describe('useClickAway', () => {
  
  it('should trigger click outside when mouse pressed and released on the same item', () => {
    const callback = jest.fn();
    const wrapper = mount(<TestComponent onClickAway={callback} />);
    Object.defineProperty(MouseEvent.prototype, 'target', {
      value: ReactDOM.findDOMNode(wrapper.find('.outside-item').instance()),
      configurable: true
    });
    document.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
    document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(callback.mock.calls.length).toBe(1);
  });

  it('should not trigger click outside when mouse pressed on one item and released on another', () => {
    const callback = jest.fn();
    const wrapper = mount(<TestComponent onClickAway={callback} />);
    Object.defineProperty(MouseEvent.prototype, 'target', {
      value: ReactDOM.findDOMNode(wrapper.find('.nested-item').instance()),
      configurable: true
    });
    document.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));

    Object.defineProperty(MouseEvent.prototype, 'target', {
      value: ReactDOM.findDOMNode(wrapper.find('.outside-item').instance()),
      configurable: true
    });
    document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(callback.mock.calls.length).toBe(0);
  });

  it('should not trigger click outside when ref node clicked', () => {
    const callback = jest.fn();
    const wrapper = mount(<TestComponent onClickAway={callback} />);
    Object.defineProperty(MouseEvent.prototype, 'target', {
      value: ReactDOM.findDOMNode(wrapper.find('.nested-item').instance()),
      configurable: true
    });
    document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(callback.mock.calls.length).toBe(0);
  });

});