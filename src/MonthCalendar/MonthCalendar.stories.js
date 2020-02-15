import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MonthCalendar from './MonthCalendar';
import './styles.css';

export const defaultComponent = () => (
  <MonthCalendar onChange={action('onChange')} />
);

storiesOf('MonthCalendar', module)
    .add('default', defaultComponent);