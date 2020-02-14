import React, { useState, useRef, useCallback } from 'react';
import moment from 'moment';

/** @type {import('./').DatePickerInputType} */
const DatePickerInput = ({
  format,
  value,
  onChange,
  onBlur,
  ...props
}) => {
  const [valueState, setValueState] = useState('');
  
  const handleChange = useCallback(event => {
    const nextValue = event.target.value;
    console.log(event.target.selectionStart)
    onChange && onChange(nextValue, event);
  }, [onChange]);

  const handleBlur = useCallback(event => {

    onBlur && onBlur(event);
  }, [onBlur]);

  return (
    <input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur} />
  );
};

export default DatePickerInput;