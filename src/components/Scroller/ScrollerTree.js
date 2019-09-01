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
  let nestedRelativeScroll = relativeScroll;
  return (
    <Scroller {...props} value={sourceValue} meta={sourceMeta} relativeScroll={relativeScroll}>
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => (
        <>
          {gaps.start ? renderGap(gaps.start) : null}
          {visibleValue.map((curVisibleValue, valueIndex) => {
            const nextIndex = index + valueIndex;
            const curMeta = curVisibleMeta[index];
            nestedRelativeScroll += (curMeta && curMeta.size) || props.defaultSize;
            const childrenProps = { index: nextIndex, value: curVisibleValue, meta: curMeta, depth };
            return curMeta && curMeta.expanded ? (
              <>
                {children({ ...childrenProps, isGroup: true })}
                <ScrollerTree
                    key={nextIndex}
                    index={nextIndex}
                    {...props}
                    value={curVisibleValue.children}
                    meta={curMeta}
                    depth={depth + 1}
                    relativeScroll={nestedRelativeScroll}
                    {...props}>
                  {children}
                </ScrollerTree>
              </>    
            ) : children(childrenProps)
          })}
          {gaps.end ? renderGap(gaps.end) : null}
        </>
      )}
    </Scroller>
  );
};

ScrollerTree.defaultProps = {
  relativeScroll: 0
};

export default ScrollerTree;