import React from 'react';
import classNames from 'classnames';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useForm, Form, Field } from './';

const FieldComponent = ({ value, onChange, error }) => {
  return (
    <div>
      <input
          className="field"
          value={value}
          onChange={event => onChange(event.target.value)} />
      <div className="field-message">{error}</div>
    </div>
  )
};

const TestComponent = ({ value, onChange, onSubmit: handleSubmit, validate }) => {
  const { formProps, onSubmit, submitting } = useForm({ value, onChange, handleSubmit, validate });
  return (
    <Form {...formProps}>
      <div>
        <Field Component={FieldComponent} name="field" />
        <button type="submit" className={classNames('submit', { submitting })} onClick={onSubmit}>Submit</button>
      </div>
    </Form>
  );
};

describe('Form', () => {

  it('should handle field change', () => {
    const onChange = jest.fn();
    const wrapper = mount(<TestComponent onChange={onChange} />);
    wrapper.find('.field').simulate('change', { target: { value: 'test' } });
    expect(onChange.mock.calls[0][0]).toEqual({ field: 'test' });
  });

  it('should submit value', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    wrapper.find('.submit').simulate('click');
    expect(onSubmit.mock.calls[0][0]).toEqual({ field: 'test' });
  });

  it('should set submitting status on async submit', () => {
    const onSubmit = jest.fn(async () => {});
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    wrapper.find('.submit').simulate('click');
    expect(wrapper.find('.submit').hasClass('submitting')).toBeTruthy();
  });

  it('should show submit sync error', () => {
    const onSubmit = jest.fn(() => ({ 'field': 'Submit error' }));
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Submit error');
  });

  it('should show submit async error', async () => {
    const onSubmit = jest.fn(async () => ({ 'field': 'Submit error' }));
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    await act(async () => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Submit error');
  });

  it('should not submit on sync validation error', () => {
    const onSubmit = jest.fn();
    const validate = () => ({ 'field': 'Validation error' });
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} validate={validate} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Validation error');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  /*it('should not submit when field validation is processing', () => {
    const onSubmit = jest.fn();
    const validate = async () => ({ 'field': 'Validation error' });
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} validate={validate} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Validation error');
    expect(onSubmit).not.toHaveBeenCalled();
  });*/

});