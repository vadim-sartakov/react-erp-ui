import React from 'react';
import Scroller from './Scroller';

const ScrollerTree = ({
  value: sourceValue,
  meta: sourceMeta,
  depth = 0,
  renderGap,
  scroll = 0,
  relativePosition = 0,
  children,
  index = 0,
  ...props
}) => {
  return (
    <Scroller {...props} value={sourceValue} meta={sourceMeta} scroll={scroll - relativePosition}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => {
        let nestedRelativePosition = gaps.start + relativePosition;
        let indexOffset = 0;
        return (
          <>
            {gaps.start ? renderGap(gaps.start) : null}
            {visibleValue.map((curVisibleValue, visibleValueIndex) => {
              const curMeta = curVisibleMeta[visibleValueIndex];
              nestedRelativePosition += (curMeta && curMeta.size) || props.defaultSize;

              const globalIndex = indexOffset + index + curVisibleValue.index;
              indexOffset = indexOffset + ((curMeta && curMeta.totalCount) || 0);

              const childrenProps = { index: globalIndex, value: curVisibleValue, meta: curMeta, depth };
              return curMeta && curMeta.expanded ? (
                <React.Fragment key={globalIndex}>
                  {children({ ...childrenProps, isGroup: true })}
                  <ScrollerTree
                      {...props}
                      index={globalIndex + 1}
                      value={curVisibleValue.children}
                      meta={curMeta}
                      depth={depth + 1}
                      scroll={scroll}
                      relativePosition={nestedRelativePosition}
                      renderGap={renderGap}>
                    {children}
                  </ScrollerTree>
                </React.Fragment>    
              ) : children(childrenProps)
            })}
            {gaps.end ? renderGap(gaps.end) : null}
          </>
        )
      }}
    </Scroller>
  );
};

export default ScrollerTree;