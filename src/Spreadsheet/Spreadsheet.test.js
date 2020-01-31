import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Spreadsheet from './Spreadsheet';
import { defaultComponent, withMergedCells, withGroups, withStyles } from './Spreadsheet.stories';
import { ScrollerContainer } from '../Scroller';
import { act } from 'react-dom/test-utils';

describe('Spreadsheet', () => {

  const mapper = json => {
    if (json.type !== 'div') {
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

  describe('groups', () => {
    const wrapper = mount(withGroups({ rowsPerPage: 50, columnsPerPage: 10 }));
    it('initial - all expanded', () => {
      expect(toJSON(wrapper.find(Spreadsheet), { map: mapper })).toMatchSnapshot();
    });
  });

  describe('styles', () => {
    const wrapper = mount(withStyles({ rowsPerPage: 50, columnsPerPage: 10 }));
    it('styled spreadsheet', () => {
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