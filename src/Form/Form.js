import React, { useMemo } from 'react';
import FormContext from './FormContext';

const Form = ({
  registeredFields,
  defaultValue,
  value,
  onChange,
  errors,
  setErrors,
  validatingFields,
  setValidatingFields,
  dirtyFields,
  setDirtyFields,
  children
}) => {
  return (
    <FormContext.Provider value={useMemo(() => ({
      registeredFields,
      defaultValue,
      value,
      onChange,
      errors,
      setErrors,
      validatingFields,
      setValidatingFields,
      dirtyFields,
      setDirtyFields
    }), [registeredFields, defaultValue, value, onChange, errors, setErrors, validatingFields, setValidatingFields, dirtyFields, setDirtyFields])}>
      {children}
    </FormContext.Provider>
  )
};

export default Form;