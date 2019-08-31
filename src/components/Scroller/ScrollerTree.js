import React from 'react';
import Scroller from './Scroller';

const ScrollerTree = ({
  value: sourceValue,
  meta: sourceMeta,
  depth = 0,
  renderGap,
  children
}) => {
  return (
    <Scroller value={sourceValue} meta={sourceMeta}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => (
        <>
          {renderGap(gaps.start)}
          {visibleValue.map((curVisibleValue, index) => {
            const curMeta = curVisibleMeta[index];
            return curMeta && curMeta.expanded ? (
              <ScrollerTree key={index} value={curVisibleValue.children} meta={curMeta} depth={depth + 1}>
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