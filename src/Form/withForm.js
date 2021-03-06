import React from 'react';
import useForm from './useForm';
import Form from './Form';

const withForm = Component => {
  return props => {
    const { formProps, ...componentProps } = useForm(props);
    return (
      <Form {...formProps}>
        <Component {...props} {...componentProps} />
      </Form>
    )
  }
};

export default withForm;