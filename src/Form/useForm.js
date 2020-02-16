import { useState, useCallback, useEffect, useMemo } from 'react';
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
  
  const [formValidating, setFormValidating] = useState(false);
  const [validatingFields, setValidatingFields] = useState([]);

  const [fieldErrors, setErrors] = useState({});
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
        setFormValidating(true);
        formErrors.then(formErrors => {
          setFormErrors(formErrors || {});
          setFormValidating(false);
        });
      } else {
        setFormErrors(formErrors || {});
      }
    }
  }, [value, validate]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(event => {
    event && event.preventDefault();
    if (submitting || formValidating || validatingFields.length || Object.keys(fieldErrors).length || Object.keys(formErrors).length) return;
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
  }, [value, fieldErrors, formErrors, handleSubmitProp, submitting, formValidating, validatingFields]);

  const errors = useMemo(() => {
    return {
      ...fieldErrors,
      ...formErrors,
      ...submitErrors
    }
  }, [fieldErrors, formErrors, submitErrors]);

  return {
    submitting,
    onSubmit: handleSubmit,
    errors,
    formProps: {
      value,
      onChange: handleChange,
      errors,
      setErrors,
      validatingFields,
      setValidatingFields
    }
  }
};

export default useForm;