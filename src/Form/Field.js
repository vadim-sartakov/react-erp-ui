import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import setIn from 'lodash/fp/set';
import FormContext from './FormContext';
import { useCallback } from 'react';

const Field = ({
  name,
  Component,
  validators,
  ...props
}) => {
  const {
    registeredFields,
    defaultValue: defaultFormValue,
    value: formValue,
    onChange,
    errors,
    setErrors: setErrorsContext,
    validatingFields,
    setValidatingFields,
    dirtyFields,
    setDirtyFields
  } = useContext(FormContext);

  useEffect(() => {
    registeredFields.current = [...registeredFields.current, name];
  }, [registeredFields, name]);

  const defaultValue = _.get(defaultFormValue, name);
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
      error = validator(value, name);
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
  }, [value, name, setErrorsContext, validators, setValidatingFields]);

  const handleChange = useCallback((inputFieldValue, event) => {
    onChange(formValue => {
      const fieldValue = typeof inputFieldValue === 'function' ? inputFieldValue(_.get(formValue, name)) : inputFieldValue;
      const nextValue = setIn(name, fieldValue, formValue);
      if (_.isEqual(fieldValue, defaultValue)) {
        setDirtyFields(dirtyFields => dirtyFields.filter(field => field !== name));
      } else {
        setDirtyFields(dirtyFields => [...dirtyFields, name]);
      }
      return nextValue;
    });
  }, [name, onChange, setDirtyFields, defaultValue]);

  const handleBlur = useCallback(() => {
    setDirtyFields(dirtyFields => [...dirtyFields, name]);
  }, [name, setDirtyFields]);

  const validating = validatingFields.some(field => field === name);
  const dirty = dirtyFields.some(field => field === name);

  return (
    <Component
        {...props}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        validating={validating}
        dirty={dirty} />
  );
};

export default Field;