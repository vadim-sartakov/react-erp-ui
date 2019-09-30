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
  
  it('should trigger when clicked outside ', () => {
    const callback = jest.fn();
    const wrapper = mount(<TestComponent onClickAway={callback} />);
    Object.defineProperty(MouseEvent.prototype, 'target', {
      value: ReactDOM.findDOMNode(wrapper.find('.outside-item').instance()),
      configurable: true
    });
    document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(callback.mock.calls.length).toBe(1);
  });

  it('should not trigger when ref node clicked', () => {
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