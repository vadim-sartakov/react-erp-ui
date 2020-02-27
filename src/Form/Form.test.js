import React from 'react';
import classNames from 'classnames';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Field, withForm } from './';

const FieldComponent = ({ value, onChange, onBlur, error, validating, dirty, triggerChangeAsCallback }) => {
  return (
    <div>
      <input
          className="field"
          value={value}
          onChange={event => triggerChangeAsCallback ? onChange(value => event.target.value) : onChange(event.target.value)}
          onBlur={onBlur} />
      <div className="field-message">{error}</div>
      {validating && <div className="field-validating-message">Validating</div>}
      {dirty && <div className="field-dirty">Dirty</div>}
    </div>
  )
};

const TestComponent = withForm(({ dirty, validating, error, submitting, onSubmit, fieldValidators, triggerChangeAsCallback }) => {
  return (
    <div>
      <Field Component={FieldComponent} name="field" validators={fieldValidators} triggerChangeAsCallback={triggerChangeAsCallback} />
      <button type="submit" className={classNames('submit', { submitting })} onClick={onSubmit}>Submit</button>
      {validating && <div className="form-validating-message">Validating</div>}
      <div className="form-message">{error}</div>
      {dirty && <div className="form-dirty">Dirty</div>}
    </div>
  );
});

describe('Form', () => {

  it('should handle field change', () => {
    const onChange = jest.fn(setter => setter({}));
    const wrapper = mount(<TestComponent onChange={onChange} />);
    wrapper.find('.field').simulate('change', { target: { value: 'test' } });
    expect(onChange.mock.results[0].value).toEqual({ field: 'test' });
  });

  it('should handle field change as callback', () => {
    const onChange = jest.fn(setter => setter({}));
    const wrapper = mount(<TestComponent onChange={onChange} triggerChangeAsCallback />);
    wrapper.find('.field').simulate('change', { target: { value: 'test' } });
    expect(onChange.mock.results[0].value).toEqual({ field: 'test' });
  });

  it('should submit value', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    wrapper.find('.submit').simulate('click');
    expect(onSubmit.mock.calls[0][0]).toEqual({ field: 'test' });
  });

  it('should show sync field error', () => {
    const value = { 'field': 'test' };
    const validators = [() => 'Field error'];
    let wrapper;
    act(() => { wrapper = mount(<TestComponent value={value} fieldValidators={validators} />) });
    expect(wrapper.find('.field-message').text()).toEqual('Field error');
  });

  it('should show async field error', async () => {
    const value = { 'field': 'test' };
    const validators = [async () => 'Field error'];
    let wrapper;
    await act(async () => { wrapper = mount(<TestComponent value={value} fieldValidators={validators} />) });
    expect(wrapper.find('.field-message').text()).toEqual('Field error');
  });

  it('should not submit on field error', () => {
    const value = { 'field': 'test' };
    const onSubmit = jest.fn();
    const validators = [() => 'Field error'];
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={value} onSubmit={onSubmit} fieldValidators={validators} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when field validation is processing', () => {
    const value = { 'field': 'test' };
    const onSubmit = jest.fn();
    const validators = [async () => 'Field error'];
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={value} onSubmit={onSubmit} fieldValidators={validators} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show async validating status on field', () => {
    const value = { 'field': 'test' };
    const validators = [async () => 'Field error'];
    let  wrapper = mount(<TestComponent value={value} fieldValidators={validators} />);
    expect(wrapper.find('.field-validating-message').length).toBe(1);
  });

  it('should proceed normally when field validation passes', async () => {
    const onSubmit = jest.fn();
    const value = { 'field': 'test' };
    const validators = [async () => undefined];
    let wrapper;
    await act(async () => wrapper = mount(<TestComponent value={value} fieldValidators={validators} onSubmit={onSubmit} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-validating-message').length).toBe(0);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should set submitting status on async submit and be unable to submit again', () => {
    const onSubmit = jest.fn(async () => {});
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    wrapper.find('.submit').simulate('click');
    expect(wrapper.find('.submit').hasClass('submitting')).toBeTruthy();
    wrapper.find('.submit').simulate('click');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should show submit sync error', () => {
    const onSubmit = jest.fn(() => ({ 'field': 'Submit error' }));
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Submit error');
  });

  it('should show submit async error', async () => {
    const onSubmit = jest.fn(async () => ({ 'field': 'Submit error', '_form': 'Form error' }));
    const wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} />);
    await act(async () => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Submit error');
    expect(wrapper.find('.form-message').text()).toEqual('Form error');
  });

  it('should not submit on sync validation error', () => {
    const onSubmit = jest.fn();
    const validate = () => ({ 'field': 'Validation error', '_form': 'Form error' });
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} validate={validate} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.field-message').text()).toEqual('Validation error');
    expect(wrapper.find('.form-message').text()).toEqual('Form error');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when form validation is processing', () => {
    const onSubmit = jest.fn();
    const validate = async () => ({ '_form': 'Validation error' });
    let wrapper;
    act(() => wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} validate={validate} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.form-validating-message').length).toBe(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should normally proceed when form validation passes', async () => {
    const onSubmit = jest.fn();
    const validate = async () => {};
    let wrapper;
    await act(async () => wrapper = mount(<TestComponent value={{ field: 'test' }} onSubmit={onSubmit} validate={validate} />));
    act(() => { wrapper.find('.submit').simulate('click'); });
    expect(wrapper.find('.form-validating-message').length).toBe(0);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should make field and form dirty on field blur', () => {
    const wrapper = mount(<TestComponent />);
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
    act(() => { wrapper.find('.field').simulate('blur') });
    wrapper.update();
    expect(wrapper.find('.field-dirty').length).toBe(1);
    expect(wrapper.find('.form-dirty').length).toBe(1);
  });

  it('should make all fields dirty on submit', () => {
    const onSubmit = () => {};
    const wrapper = mount(<TestComponent onSubmit={onSubmit} />);
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
    act(() => { wrapper.find('.submit').simulate('click') });
    wrapper.update();
    expect(wrapper.find('.field-dirty').length).toBe(1);
    expect(wrapper.find('.form-dirty').length).toBe(1);
  });

  it('should reset dirty state when initialized', () => {
    const onSubmit = () => {};
    let wrapper;
    act(() => { wrapper = mount(<TestComponent onSubmit={onSubmit} />) });
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
    act(() => { wrapper.find('.submit').simulate('click') });
    wrapper.update();
    expect(wrapper.find('.field-dirty').length).toBe(1);
    expect(wrapper.find('.form-dirty').length).toBe(1);
    
    act(() => { wrapper.setProps({ defaultValue: {} }) });
    wrapper.update();
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
  });

  it('should remove dirty state once it equal to initial value', () => {
    const onSubmit = () => {};
    let wrapper;
    act(() => { wrapper = mount(<TestComponent onSubmit={onSubmit} defaultValue={{ field: 'text' }} />) });
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
    act(() => { wrapper.find('.submit').simulate('click') });
    act(() => { wrapper.find('.field').simulate('change', { target: { value: 'test' } }); });

    expect(wrapper.find('.field-dirty').length).toBe(1);
    expect(wrapper.find('.form-dirty').length).toBe(1);

    act(() => { wrapper.find('.field').simulate('change', { target: { value: 'text' } }); });

    wrapper.update();
    expect(wrapper.find('.field-dirty').length).toBe(0);
    expect(wrapper.find('.form-dirty').length).toBe(0);
  });

});