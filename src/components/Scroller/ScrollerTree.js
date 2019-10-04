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
  ...props
}) => {
  return (
    <Scroller {...props} value={sourceValue} meta={sourceMeta} scroll={scroll - relativePosition}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => {
        let nestedRelativePosition = gaps.start + relativePosition;
        return (
          <>
            {gaps.start ? renderGap(gaps.start) : null}
            {visibleValue.map((curVisibleValue, index) => {
              const curMeta = curVisibleMeta[index];
              nestedRelativePosition += (curMeta && curMeta.size) || props.defaultSize;
              const childrenProps = { index, value: curVisibleValue, meta: curMeta, depth };
              return curMeta && curMeta.expanded ? (
                <React.Fragment key={index}>
                  {children({ ...childrenProps, isGroup: true })}
                  <ScrollerTree
                      {...props}
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