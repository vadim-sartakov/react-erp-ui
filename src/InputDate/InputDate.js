import React, { useState, useRef, useCallback, useMemo } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';

/** @type {import('./').InputDateType} */
const InputDate = ({
  format = 'DD/MM/YYYY',
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

  const mask = useMemo(() => format.replace(/[\w]/g, '9'), [format]);

  return (
    <InputMask
        {...props}
        mask={mask}
        value={inputValue}
        onChange={handleInputChange} />
  );
};

export default InputDate;