import React, { useMemo } from 'react';
import FormContext from './FormContext';

const Form = ({
  value,
  onChange,
  fieldErrors,
  setFieldErrors,
  children
}) => {
  return (
    <FormContext.Provider value={useMemo(() => ({
      value,
      onChange,
      fieldErrors,
      setFieldErrors
    }), [value, onChange, fieldErrors, setFieldErrors])}>
      {children}
    </FormContext.Provider>
  )
};

export default Form;