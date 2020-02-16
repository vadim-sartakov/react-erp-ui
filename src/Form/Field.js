import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import FormContext from './FormContext';
import { useCallback } from 'react';

const Field = ({
  name,
  Component,
  validators,
  ...props
}) => {
  const {
    value: formValue,
    onChange,
    errors,
    setErrors: setErrorsContext,
    validatingFields,
    setValidatingFields
  } = useContext(FormContext);

  let value = _.get(formValue, name);
  const error = errors && errors[name];

  useEffect(() => {
    if (!validators || !validators.length) return;

    const setErrors = error => errors => {
      if (error) return { ...errors, [name]: error };
      else return _.omit(errors, name);
    };

    let error;
    for (let i = 0; i < validators.length; i++) {
      if (error) break;
      const validator = validators[i];
      error = validator(value, formValue, name);
    }

    if (error.then) {
      setValidatingFields(validatingFields => [...validatingFields, name]);
      return error.then(error => {
        setErrorsContext(setErrors(error));
        setValidatingFields(validatingFields => validatingFields.filter(field => field !== name));
      });
    } else {
      setErrorsContext(setErrors(error));
    }
  }, [value, formValue, name, setErrorsContext, validators, setValidatingFields]);

  const handleChange = useCallback((fieldValue, event) => {
    onChange(name, fieldValue, event);
  }, [name, onChange]);

  const validating = validatingFields.some(field => field === name);

  return (
    <Component
        {...props}
        name={name}
        value={value}
        onChange={handleChange}
        error={error}
        validating={validating} />
  );
};

export default Field;