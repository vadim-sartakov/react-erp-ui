import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

const defaultValueObject = {};

/** @type {import('./').useFormType} */
const useForm = ({
  defaultValue = defaultValueObject,
  value: valueProp,
  onChange: onChangeProp,
  validate,
  handleSubmit: handleSubmitProp
}) => {
  const registeredFields = useRef([]);

  // Cleaning up dirty state on initialize
  useEffect(() => {
    setDirtyFields([]);
  }, [defaultValue]);

  const [stateValue, setStateValue] = useState(defaultValue);
  
  const [formValidating, setFormValidating] = useState(false);
  const [validatingFields, setValidatingFields] = useState([]);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitErrors, setSubmitErrors] = useState({});

  const [dirtyFields, setDirtyFields] = useState([]);

  const value = valueProp || stateValue;
  const onChange = onChangeProp || setStateValue;

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
    setDirtyFields([...registeredFields.current]);
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

  const validating = formValidating || validatingFields.length;
  const dirty = dirtyFields.length > 0;

  return {
    submitting,
    validating,
    onSubmit: handleSubmit,
    error: errors._form,
    dirty,
    formProps: {
      registeredFields,
      defaultValue,
      value,
      onChange,
      errors,
      setErrors: setFieldErrors,
      validatingFields,
      setValidatingFields,
      dirtyFields,
      setDirtyFields
    }
  }
};

export default useForm;