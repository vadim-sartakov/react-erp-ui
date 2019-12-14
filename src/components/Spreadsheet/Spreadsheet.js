import React from 'react';
import { useScroller } from '../Scroller';
import { ScrollerContainer } from '../Scroller';
import SpreadsheetContainer from './SpreadsheetContainer';
import useSpreadsheet from './useSpreadsheet';
import useSpreadsheetRender from './useSpreadsheetRender';

/**
 * @param {import('./').SpreadsheetProps} props 
 */
const Spreadsheet = props => {
  const {
    spreadsheetContainerProps,
    scrollerOptions
  } = useSpreadsheet(props);

  const {
    scrollerContainerProps,
    gridStyles,
    ...renderOptions
  } = useScroller({
    ...props,
    ...scrollerOptions
  });

  const elements = useSpreadsheetRender({ ...renderOptions, ...props });

  return (
    <ScrollerContainer {...props} {...scrollerContainerProps}>
      <SpreadsheetContainer
          {...props}
          {...spreadsheetContainerProps}
          style={gridStyles}>
        {elements}
      </SpreadsheetContainer>
    </ScrollerContainer>
  );
};

export default Spreadsheet;