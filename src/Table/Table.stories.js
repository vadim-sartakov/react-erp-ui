import React from 'react';
import { storiesOf } from '@storybook/react';
import {} from './';
import './Table.stories.sass';

export const TableComponent = ({ ...props }) => {
  return (
    <div {...props}>

    </div>
  )
};

storiesOf('Table', module)
  .add('default');