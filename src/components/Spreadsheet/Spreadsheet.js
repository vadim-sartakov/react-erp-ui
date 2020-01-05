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
  const spreadsheetProps = useSpreadsheet(props);

  const {
    scrollerContainerProps,
    gridStyles,
    ...scrollerProps
  } = useScroller({
    ...props,
    ...spreadsheetProps
  });

  const elements = useSpreadsheetRender({ ...props, ...spreadsheetProps, ...scrollerProps });

  return (
    <ScrollerContainer {...props} {...scrollerContainerProps}>
      <SpreadsheetContainer
          {...props}
          {...spreadsheetProps}
          style={gridStyles}>
        {elements}
      </SpreadsheetContainer>
    </ScrollerContainer>
  );
};

export default Spreadsheet;