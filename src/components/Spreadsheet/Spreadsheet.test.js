import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { defaultComponent } from './Spreadsheet.stories';

describe('Spreadsheet', () => {
  
  it.only('should render correctly', () => {
    let wrapper;
    act(() => { wrapper = mount(defaultComponent()) });
  });

});