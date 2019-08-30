import React from 'react';

// This component should buffer values
// and maybe calculate current page?
const ScrollerItems = ({
  // Visible value
  value,
  meta: { children: metaChildren },
  depth = 0,
  children
}) => {
  return (
    <>
      {value.map((curValue, index) => {
        const curMeta = metaChildren[index];
        return (
          <React.Fragment key={index}>
            {/* add map here since client expecting callback execution per each value */}
            {children(curValue, curMeta, depth)}
            {curMeta.expanded ? (
              <ScrollerItems key={index} value={curValue.children} meta={curMeta} depth={depth + 1}>
                {children}
              </ScrollerItems>
            ) : null}
          </React.Fragment>
        )
      })}
    </>
  );
};

export default ScrollerItems;