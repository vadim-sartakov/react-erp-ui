import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputDate from './InputDate';

export const defaultComponent = () => (
  <InputDate
      style={{ padding: 10, border: 'solid 1px #ccc', borderRadius: 4 }}
      onChange={action('onChange')} />
);

storiesOf('InputDate', module)
    .add('default', defaultComponent);