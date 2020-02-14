import React, { useState, useRef, useCallback } from 'react';
import moment from 'moment';

/** @type {import('./').DatePickerInputType} */
const DatePickerInput = ({
  format = 'DD.MM.YYYY',
  defaultValue,
  onChange,
  ...props
}) => {
  const inputCaretPosition = useRef();
  const [inputValue, setInputValue] = useState((defaultValue && defaultValue.format(format)) || '');
  
  const handleInputChange = useCallback(event => {
    const nextInputValue = event.target.value;
    inputCaretPosition.current = event.target.selectionStart;
    setInputValue(nextInputValue);
    const nextValue = moment(nextInputValue, format, true);
    onChange && onChange(nextValue);
  }, [format, onChange]);

  return (
    <input
        {...props}
        value={inputValue}
        onChange={handleInputChange} />
  );
};

export default DatePickerInput;