import React from 'react';
import Scroller from './Scroller';

const ScrollerTree = ({
  value: sourceValue,
  meta: sourceMeta,
  depth = 0,
  renderGap,
  relativeScroll,
  index = 0,
  children,
  ...props
}) => {
  return (
    <Scroller {...props} value={sourceValue} meta={sourceMeta} relativeScroll={relativeScroll}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => (
        <>
          {gaps.start ? renderGap(gaps.start) : null}
          {visibleValue.map((curVisibleValue, valueIndex) => {
            const nextIndex = index + valueIndex;
            const curMeta = curVisibleMeta[index];
            // TODO: calculate and pass children relative scroll
            return curMeta && curMeta.expanded ? (
              <ScrollerTree key={nextIndex} index={nextIndex} {...props} value={curVisibleValue.children} meta={curMeta} depth={depth + 1} {...props}>
                {children}
              </ScrollerTree>
            ) : children({ index: nextIndex, value: curVisibleValue, meta: curMeta, depth })
          })}
          {gaps.end ? renderGap(gaps.end) : null}
        </>
      )}
    </Scroller>
  );
};

export default ScrollerTree;