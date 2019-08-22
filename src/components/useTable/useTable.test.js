import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useTable from '.';

const TestTable = ({
  columnsCount,
  rowsCount
}) => {
  const columnsRootRef = useRef(null);
  const { dimensions, onResize } = useTable({
    columnsRootRef
  });
  const columnsArray = new Array(columnsCount).fill(0);
  const rowsArray = new Array(rowsCount).fill(0);
  return (
    <table>
      <thead>
        <tr ref={columnsRootRef}>
          {columnsArray.map((columnItem, columnIndex) => {
            const style = { width: dimensions.columns.size[columnIndex] };
            return (
              <th key={columnIndex} style={style} className={`column-${columnIndex}`}>
                <div>{`Column ${columnIndex}`}</div>
                <div
                    className={`column-resizer-${columnIndex}`}
                    onMouseDown={event => onResize(event, 'columns', columnIndex)} />
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rowsArray.map((rowItem, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {columnsArray.map((columnItem, columnIndex) => {
                return (
                  <td key={columnIndex}>
                    {`Row ${rowIndex} column ${columnIndex}`}
                  </td>
                )
              })}
            </tr>   
          )
        })}
      </tbody>
    </table>
  )
};

describe('Resize', () => {

  beforeAll(() => Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: 100 }));

  it('resizes first and second columns, leaves third unchanged', () => {
  
    let wrapper;
    act(() => {
      wrapper = mount(<TestTable columnsCount={3} rowsCount={10} />);
    });
    const resizer = wrapper.find('.column-resizer-0');
    act(() => {
      resizer.simulate('mousedown', { clientX: 50 });
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    
    wrapper.update();
  
    const columns = wrapper.find('th');
    expect(columns.at(0).prop('style')).toHaveProperty('width', 70);
    expect(columns.at(1).prop('style')).toHaveProperty('width', 130);
    expect(columns.at(2).prop('style')).toHaveProperty('width', undefined);
    
  });

});