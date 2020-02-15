import { useState, useCallback, useEffect } from 'react';
import setIn from 'lodash/fp/set';

/** @type {import('./').useFormType} */
const useForm = ({
  defaultValue,
  value: valueProp,
  onChange: onChangeProp,
  validate,
  handleSubmit: handleSubmitProp
}) => {
  const [stateValue, setStateValue] = useState(defaultValue || {});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitErrors, setSubmitErrors] = useState({});

  const value = valueProp || stateValue;
  const onChange = onChangeProp || setStateValue;

  const handleChange = useCallback((property, propertyValue) => {
    const nextValue = setIn(property, propertyValue, value);
    onChange(nextValue);
  }, [value, onChange]);

  useEffect(() => {
    if (validate) {
      const formErrors = validate(value);
      if (!formErrors) {
        return;
      } else if (formErrors.then) {
        formErrors.then(formErrors => setFormErrors(formErrors || {}));
      } else {
        setFormErrors(formErrors || {});
      }
    }
  }, [value, validate]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(event => {
    event && event.preventDefault();
    if (submitting || Object.keys(fieldErrors).length) return;
    const submitErrors = handleSubmitProp(value);
    if (submitErrors && submitErrors.then) {
      setSubmitting(true);
      submitErrors.then(submitErrors => {
        setSubmitErrors(submitErrors || {});
        setSubmitting(false);
      });
    } else {
      setSubmitErrors(submitErrors || {});
    }
  }, [value, fieldErrors, handleSubmitProp, submitting]);

  return {
    submitting,
    onSubmit: handleSubmit,
    formProps: {
      value,
      onChange: handleChange,
      fieldErrors: {
        ...fieldErrors,
        ...formErrors,
        ...submitErrors
      },
      setFieldErrors
    }
  }
};

export default useForm;