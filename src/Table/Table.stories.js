import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from './';
import { randomDate, getRandomInt } from '../test-utils/generateValues';
import './Table-stories.module.sass';

/** @type {import('./').Column[]} */
const columns = [
  {
    title: 'First name',
    valuePath: 'firstName'
  },
  {
    title: 'Second name',
    valuePath: 'secondName'
  },
  {
    title: 'Number',
    type: 'number',
    valuePath: 'number'
  },
  {
    title: 'Date of birth',
    type: 'date',
    valuePath: 'birthDay'
  },
  {
    title: 'Department',
    valuePath: 'department.name'
  }
];

const generateDepartments = count => {
  return [...new Array(count).keys()].map(key => ({ name: `Department ${key}` }))
};
const departments = generateDepartments(20);

const generateEmployees = count => {
  return [...new Array(count).keys()].map(key => {
    return {
      firstName: `First name ${key}`,
      lastName: `Last name ${key}`,
      borthDay: randomDate(new Date(1970, 0, 0), new Date(2000, 0, 0)),
      number: key,
      department: departments[getRandomInt(0, departments.length)]
    }
  });
};

const employees = generateEmployees(1000);

export const TableComponent = ({ ...props }) => {
  return <Table {...props} />
};

export const defaultTable = props => {
  return (
    <TableComponent
        columns={columns}
        value={employees}
        totalColumns={columns.length}
        totalRows={employees.length}
        rowsPerPage={60}
        columnsPerPage={15}
        defaultRowHeight={30}
        defaultColumnWidth={150}
        height={600}
        {...props} />
  )
};

storiesOf('Table', module)
  .add('default', defaultTable);