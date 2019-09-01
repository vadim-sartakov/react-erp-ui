import React from 'react';
import Scroller from './Scroller';

const ScrollerTree = ({
  value: sourceValue,
  meta: sourceMeta,
  depth = 0,
  renderGap,
  relativeScroll,
  children,
  ...props
}) => {
  return (
    <Scroller {...props} value={sourceValue} meta={sourceMeta} relativeScroll={relativeScroll}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => (
        <>
          {gaps.start ? renderGap(gaps.start) : null}
          {visibleValue.map((curVisibleValue, index) => {
            const curMeta = curVisibleMeta[index];
            // TODO: calculate and pass children relative scroll
            return curMeta && curMeta.expanded ? (
              <ScrollerTree key={index} {...props} value={curVisibleValue.children} meta={curMeta} depth={depth + 1} {...props}>
                {children}
              </ScrollerTree>
            ) : children({ value: curVisibleValue, meta: curMeta, depth })
          })}
          {gaps.end ? renderGap(gaps.end) : null}
        </>
      )}
    </Scroller>
  );
};

export default ScrollerTree;