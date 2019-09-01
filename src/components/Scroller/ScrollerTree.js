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
          {renderGap(gaps.start)}
          {visibleValue.map((curVisibleValue, index) => {
            const curMeta = curVisibleMeta[index];
            // TODO: calculate and pass children relative scroll
            return curMeta && curMeta.expanded ? (
              <ScrollerTree key={index} {...props} value={curVisibleValue.children} meta={curMeta} depth={depth + 1} {...props}>
                {children}
              </ScrollerTree>
            ) : children({ value: curVisibleValue, meta: curMeta, depth })
          })}
          {renderGap(gaps.end)}
        </>
      )}
    </Scroller>
  );
};

export default ScrollerTree;