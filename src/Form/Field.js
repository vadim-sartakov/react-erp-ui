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
    fieldErrors,
    setFieldErrors
  } = useContext(FormContext);

  let value = _.get(formValue, name);
  const error = fieldErrors && fieldErrors[name];

  useEffect(() => {
    const setErrors = error => errors => {
      if (error) return { ...errors, [name]: error };
      else return _.omit(errors, name);
    };

    const error = validators && validators.reduce((acc, validator) => {
      if (acc) return acc;

      const error = validator(value, formValue, name);
      if (!error) return acc;

      if (error.then) {
        return error.then(error => {
          setFieldErrors(setErrors(error));
        });
      } else {
        return error;
      }
    }, false);
    setFieldErrors(setErrors(error));
  }, [value, formValue, name, setFieldErrors, validators]);

  const handleChange = useCallback((fieldValue, event) => {
    onChange(name, fieldValue, event);
  }, [name, onChange]);

  return (
    <Component
        {...props}
        name={name}
        value={value}
        onChange={handleChange}
        error={error} />
  );
};

export default Field;