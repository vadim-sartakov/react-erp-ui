import React from 'react';
import { storiesOf } from '@storybook/react';
import DatePickerInput from './DatePickerInput';

export const keyboardInput = () => <DatePickerInput />;

storiesOf('DatePicker', module)
    .add('keyboard input', keyboardInput);