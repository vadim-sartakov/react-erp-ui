import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DatePickerInput from './DatePickerInput';

export const keyboardInput = () => (
  <DatePickerInput
      style={{ padding: 10, border: 'solid 1px #ccc', borderRadius: 4 }}
      onChange={action('onChange')} />
);

storiesOf('DatePicker', module)
    .add('keyboard input', keyboardInput);