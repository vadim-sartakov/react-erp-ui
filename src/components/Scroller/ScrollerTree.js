import React from 'react';
import Scroller from './Scroller';

const scrolledItemsReducer = (acc, metaChild) => {
  if (!metaChild) return acc;
  const children = (metaChild.children && metaChild.children.reduce(scrolledItemsReducer, 0)) || 0;
  return acc + (metaChild.totalCount || 0) + children;
};

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
      {({ value: visibleValue, meta: curVisibleMeta, gaps, originMeta }) => {
        let nestedRelativePosition = gaps.start + relativePosition;
        return (
          <>
            {gaps.start ? renderGap(gaps.start) : null}
            {visibleValue.map((curVisibleValue, visibleValueIndex) => {
              const curMeta = curVisibleMeta[visibleValueIndex];
              nestedRelativePosition += (curMeta && curMeta.size) || props.defaultSize;

              let globalIndex = index + curVisibleValue.index;
              const scrolledItemsCount = (originMeta && originMeta.children && originMeta.children.slice(0, globalIndex).reduce(scrolledItemsReducer, 0)) || 0;
              globalIndex = globalIndex + scrolledItemsCount;

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