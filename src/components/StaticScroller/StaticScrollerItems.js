import React from 'react';

const StaticScrollItems = ({
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
            {children(curValue, curMeta, depth)}
            {curMeta.expanded ? (
              <StaticScrollItems key={index} value={curValue.children} meta={curMeta} depth={depth + 1}>
                {children}
              </StaticScrollItems>
            ) : null}
          </React.Fragment>
        )
      })}
    </>
  );
};

export default StaticScrollItems;