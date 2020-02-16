import React, { useMemo } from 'react';
import FormContext from './FormContext';

const Form = ({
  value,
  onChange,
  errors,
  setErrors,
  validatingFields,
  setValidatingFields,
  children
}) => {
  return (
    <FormContext.Provider value={useMemo(() => ({
      value,
      onChange,
      errors,
      setErrors,
      validatingFields,
      setValidatingFields
    }), [value, onChange, errors, setErrors, validatingFields, setValidatingFields])}>
      {children}
    </FormContext.Provider>
  )
};

export default Form;