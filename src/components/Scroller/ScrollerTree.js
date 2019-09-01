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
      {({ value: visibleValue, meta: curVisibleMeta, gaps }) => {
        let nestedRelativeScroll = gaps.start + relativeScroll;
        return (
          <>
            {gaps.start ? renderGap(gaps.start) : null}
            {visibleValue.map((curVisibleValue, index) => {
              const curMeta = curVisibleMeta[index];
              nestedRelativeScroll += (curMeta && curMeta.size) || props.defaultSize;
              const childrenProps = { index, value: curVisibleValue, meta: curMeta, depth };
              return curMeta && curMeta.expanded ? (
                <React.Fragment key={index}>
                  {children({ ...childrenProps, index, isGroup: true })}
                  <ScrollerTree
                      {...props}
                      value={curVisibleValue.children}
                      meta={curMeta}
                      depth={depth + 1}
                      relativeScroll={nestedRelativeScroll}
                      renderGap={renderGap}
                      {...props}>
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

ScrollerTree.defaultProps = {
  relativeScroll: 0
};

export default ScrollerTree;