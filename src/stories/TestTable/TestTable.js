import React from 'react';
import { Scroller, ScrollerItems } from '../../components';

const exampleMeta = {
  totalCount: 1000
};

const exampleValue = [

];

const TestTable = ({
  rows,
  columns,
  value
}) => {
  return (
    <div style={{ overflowAnchor: 'none' }}>
      <table>
        <thead>
          <Scroller>

          </Scroller>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  )
};

export default TestTable;