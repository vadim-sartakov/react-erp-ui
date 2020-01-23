import React from 'react';
import { useScroller, ScrollerContainer } from '../Scroller';
import { SpreadsheetContainer, useSpreadsheet, useSpreadsheetRender } from './';

const Spreadsheet = props => {
  const spreadsheetProps = useSpreadsheet(props);

  const { gridStyles, ...scrollerProps } = useScroller({
    ...props,
    ...spreadsheetProps
  });

  const elements = useSpreadsheetRender({ ...props, ...spreadsheetProps, ...scrollerProps });

  return (
    <ScrollerContainer {...props} {...scrollerProps}>
      <SpreadsheetContainer
          {...props}
          {...spreadsheetProps}
          scrollerTop={scrollerProps.pagesStyles.top}
          scrollerLeft={scrollerProps.pagesStyles.left}
          style={gridStyles}>
        {elements}
      </SpreadsheetContainer>
    </ScrollerContainer>
  );
};

export default Spreadsheet;