import React from 'react';
import { storiesOf } from '@storybook/react';
import './Table-stories.module.sass';

export const TableComponent = ({ ...props }) => {
  return (
    <div {...props}>

    </div>
  )
};

storiesOf('Table', module)
  .add('default');