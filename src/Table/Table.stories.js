import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from './';
import { randomDate, getRandomInt } from '../test-utils/generateValues';
import moment from 'moment';
import './styles.css';

/** @type {import('./').Column[]} */
const columns = [
  {
    title: 'First name',
    valuePath: 'firstName'
  },
  {
    title: 'Last name',
    valuePath: 'lastName'
  },
  {
    title: 'Number',
    type: 'number',
    valuePath: 'number',
    footerValue: value => {
      const total = value.reduce((acc, item) => acc + item.number, 0);
      return `Avarage is ${(total / value.length).toFixed(2)}`
    }
  },
  {
    title: 'Date of birth',
    type: 'date',
    valuePath: 'birthDay',
    format: value => moment(value).format('DD/MM/YYYY')
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
      birthDay: randomDate(new Date(1970, 0, 0), new Date(2000, 0, 0)),
      number: getRandomInt(0, 1000),
      department: departments[getRandomInt(0, departments.length - 1)]
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

export const withFooter = props => {
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
        fixColumns={1}
        showFooter
        {...props} />
  )
};

storiesOf('Table', module)
  .add('default', defaultTable)
  .add('withFooter', withFooter);