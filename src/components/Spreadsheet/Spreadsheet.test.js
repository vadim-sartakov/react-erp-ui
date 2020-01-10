import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Spreadsheet from './Spreadsheet';
import { defaultComponent, withMergedCells } from './Spreadsheet.stories';
import { ScrollerContainer } from '../Scroller';
import { act } from 'react-dom/test-utils';

describe('Spreadsheet', () => {

  const mapper = json => {
    if (json.type === 'Spreadsheet' || json.type === 'ScrollerContainer' || json.type === 'SpreadsheetContainer') {
      return {
        ...json,
        props: {
          ...json.props,
          value: `length: ${json.props.value.length} - ${json.props.value[json.props.value.length - 1].length}`
        }
      }
    }
    if (json.type === 'SpreadsheetCell') {
      return {
        ...json,
        props: {
          ...json.props,
          rows: json.props.rows && `length: ${json.props.rows.length}`,
          columns: json.props.columns && `length: ${json.props.columns.length}`
        }
      }
    }
    if (json.type === 'ScrollerCell') {
      return {
        ...json,
        props: {}
      }
    }
    return json;
  };

  describe('merged cells', () => {

    const wrapper = mount(withMergedCells({ rowsPerPage: 30, columnsPerPage: 10 }));

    it('start', () => {
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

    it('middle rows', () => {
      wrapper.find(ScrollerContainer).find('div').first().simulate('scroll', { target: { scrollTop: 3400 } });
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

    it('middle columns', () => {
      wrapper.find(ScrollerContainer).find('div').first().simulate('scroll', { target: { scrollLeft: 3200 } });
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

    it('end rows', () => {
      wrapper.find(ScrollerContainer).find('div').first().simulate('scroll', { target: { scrollTop: 24000 } });
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

    it('end columns', () => {
      wrapper.find(ScrollerContainer).find('div').first().simulate('scroll', { target: { scrollLeft: 5200 } });
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

  });

  describe('resize', () => {

    it('should resize columns and rows', () => {
      const wrapper = mount(defaultComponent({ rowsPerPage: 30, columnsPerPage: 10 }));

      const invokeResize = (element, x, y) => {
        element.simulate('mousedown', { clientX: 0, clientY: 0 });
        act(() => {
          document.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
          document.dispatchEvent(new MouseEvent('mouseup'));
        });
        wrapper.update();
      };

      invokeResize(wrapper.find('.columnResizer').first(), 50, 0);
      invokeResize(wrapper.find('.columnResizer').last(), 50, 0);

      invokeResize(wrapper.find('.rowResizer').first(), 0, 50);
      invokeResize(wrapper.find('.rowResizer').last(), 0, 50);
      
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });

  });

});