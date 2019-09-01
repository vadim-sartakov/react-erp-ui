import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import useBufferedPages from './useBufferedPages';

const getVisiblePages = currentPage => currentPage === 0 ? [currentPage] : [currentPage - 1, currentPage];

const getVisiblePagesAndPaddings = ({ scroll, entries, defaultSize, itemsPerPage, totalCount }) => {
  let page = 0, visiblePages = {}, startSectionSize = 0, viewingPagesSize = 0, endSectionSize = 0;

  // Auto calculation mode. Involves default parameters
  if (totalCount) {
    const pageSize = defaultSize * itemsPerPage;
    page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);

    visiblePages.pages = getVisiblePages(page);
    startSectionSize = visiblePages.pages[0] * pageSize;

    const itemsOnFirstPage = Math.min(totalCount, itemsPerPage);
    const itemsOnSecondPage = page > 0 ? Math.min(totalCount - (page * itemsPerPage), itemsPerPage) : 0;

    viewingPagesSize += (itemsOnFirstPage + itemsOnSecondPage) * defaultSize;
    endSectionSize = defaultSize * totalCount - startSectionSize - viewingPagesSize;

  // Manual entries crawling mode
  } else {
    
    let curScroll = 0, itemsOnPage = 0;
    for (let index = 0; index < entries.length; index++) {
      if (curScroll >= scroll) break;
      const curEntry = entries[index];
      const size = curEntry.size || defaultSize;
  
      if (curScroll < scroll) {
        const isNextPage = index > 0 && index % itemsPerPage === 0;
        scroll = curScroll + size;
        page = isNextPage ? page + 1 : page;
        itemsOnPage = isNextPage ? 0 : itemsOnPage + 1;
        startSectionSize += size;
      }
  
      if (curEntry.expanded) {
        const [nestedVisiblePages, nestedPaddings] = getVisiblePagesAndPaddings({
          scroll: scroll - curScroll,
          entries: entries.children,
          itemsPerPage,
          defaultSize
        });
        if (!visiblePages.children) visiblePages.children = [];
        visiblePages.children.push({ [index]: nestedVisiblePages });
        startSectionSize += nestedPaddings.start;
        endSectionSize += nestedPaddings.end;
      }
      
    }

    visiblePages.pages = getVisiblePages(page);

  }

  return [
    visiblePages,
    { start: startSectionSize, end: endSectionSize }
  ];
};

const directionToScrollEventMap = {
  vertical: 'scrollTop',
  horizontal: 'scrollLeft'
};

// Make scroller only for one dimension (either rows or column specific)
const Scroller = ({
  meta,
  defaultSize,
  itemsPerPage,
  scrollContainerRef,
  scrollDirection,
  relativeScroll,
  value,
  loadPage,
  children
}) => {

  const [scroll, setScroll] = useState(0);

  const currentPage = useMemo(() => {
    let page;
    if (!meta || !meta.children || !meta.children.some(item => Boolean(item.size))) {
      const pageSize = defaultSize * itemsPerPage;
      page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
    } else {
      
    }
    return page;
  }, [scroll, meta, defaultSize, itemsPerPage]);

  // TODO: think about server side meta loading
  const [visibleMetaPages] = useBufferedPages({
    value: ( meta && meta.children ) || [],
    page: currentPage,
    itemsPerPage
  });
  const [visiblePages, totalCount] = useBufferedPages({
    value,
    page: currentPage,
    loadPage,
    itemsPerPage
  });

  const gaps = useMemo(() => {
    let startSectionSize = 0, viewingPagesSize = 0, endSectionSize = 0;

    const pageSize = defaultSize * itemsPerPage;
    if (!meta || !meta.children || !meta.children.some(item => Boolean(item.size))) {
      startSectionSize = visiblePages[0].page * pageSize;
      viewingPagesSize = visiblePages.reduce((acc, page) => acc + page.value.length, 0) * defaultSize;
      endSectionSize = defaultSize * totalCount - startSectionSize - viewingPagesSize;
    } else {
      
    }

    return {
      start: startSectionSize,
      end: endSectionSize
    };
  }, [defaultSize, itemsPerPage, meta, visiblePages, totalCount]);

  const handleScroll = useCallback(event => {
    setScroll(event.target[directionToScrollEventMap[scrollDirection]] - relativeScroll);
  }, [scrollDirection, relativeScroll]);

  useEffect(() => {
    if (scrollContainerRef) {
      const node = scrollContainerRef.current;
      node.addEventListener('scroll', handleScroll);
      return () => {
        node.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollContainerRef, handleScroll]);

  const visibleValuesReducer = (acc, page) => [...acc, ...page.value];

  const visibleValue = visiblePages.reduce(visibleValuesReducer, []);
  const visibleMeta = visibleMetaPages.reduce(visibleValuesReducer, []);
  
  return (
    <>
      {children({ value: visibleValue, meta: visibleMeta, gaps })}
    </>
  );
};

Scroller.propTypes = {
  meta: PropTypes.shape({
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  defaultSize: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  scrollContainerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  /** Offsets relative to scroll container */
  relativeScroll: PropTypes.number,
  scrollDirection: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,

  /**
   * Component functions in 2 modes: Dynamic and static.
   * Static involves traversing the columns and rows tree while
   * dynamic fetches the data with 'loadPage' callback relying on children count property of rows and columns meta.
   * */
  value: PropTypes.arrayOf(PropTypes.object),
  /** (page, size) => array */
  loadPage: PropTypes.func
};

Scroller.defaultProps = {
  defaultSize: 0,
  relativeScroll: 0,
  itemsPerPage: 40
};

export default Scroller;