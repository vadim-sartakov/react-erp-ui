import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useBufferedPages } from '../';

const defaultLoadPage = ({ rows, rowPage, visibleColumns, columnsPerPage, rowsPerPage }) => {
  return rows.slice(rowPage * rowsPerPage, (rowPage + 1) * rowsPerPage);
};

// Make it generic. It should accept array and shrink it according to visible pages
const applyVisiblePages = ({ rows, visibleColumns, visibleRows, columnsPerPage, rowsPerPage }) => {
  const result = [];
  const firstPage = defaultLoadPage({ rows, rowPage: visibleRows.pages[0], visibleColumns, columnsPerPage, rowsPerPage });
  result.push(...firstPage);

  if (visibleRows.children) {
    const entries = Object.entries(visibleRows);

    for (let index = 0; index < entries.length; index++) {
      const [childIndex, childVisiblePages] = entries[index];
      const nestedValue = applyVisiblePages(rows.children[childIndex], visibleColumns, childVisiblePages, columnsPerPage, rowsPerPage);
      // Does it mutate origin object?
      result[childIndex].chilren = nestedValue;
    }
  }

  if (visibleRows.pages[1]) {
    const secondPage = defaultLoadPage({ rows, rowPage: visibleRows.pages[1], visibleColumns, columnsPerPage, rowsPerPage });
    result.push(...secondPage);
  }

  return result;
};

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

const getCurrentPage = (scroll, meta, defaultSize, itemsPerPage) => {
  let page;
  if (!meta || !meta.children) {
    const pageSize = defaultSize * itemsPerPage;
    page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
  } else {

  }
  return page;
};

const getMargins = (scroll, meta, defaultSize, ) => {

};

// Make scroller only for one dimension (either rows or column specific)
const Scroller = ({
  rows,
  columns,
  defaultRowHeight,
  defaultColumnWidth,
  columnsPerPage,
  rowsPerPage,
  scrollContainerRef,
  relativeScroll,
  value,
  loadPage,
  children,
  ...props
}) => {

  const getRelativeScroll = absoluteScroll => ({
    top: absoluteScroll.top - relativeScroll.top,
    teft: absoluteScroll.teft - relativeScroll.teft
  });
  const [scroll, setScroll] = useState(getRelativeScroll({
    top: scrollContainerRef.current.scrollTop - relativeScroll.top,
    teft: scrollContainerRef.current.scrollLeft - relativeScroll.teft
  }));

  const currentRowPage = getCurrentPage(scroll.top, rows, defaultRowHeight, rowsPerPage);
  const currentColumnPage = getCurrentPage(scroll.left, columns, defaultColumnWidth, columnsPerPage);

  const visibleRowsMeta = useBufferedPages({ value: rows, page: currentRowPage, loadPage, itemsPerPage: rowsPerPage });
  const visibleColumnsMeta = useBufferedPages({ value: columns, page: currentColumnPage, loadPage, itemsPerPage: columnsPerPage });
  const visibleValue = useBufferedPages({ value, page: currentRowPage, loadPage, itemsPerPage: rowsPerPage });

  const margins = getMargins();

  const [state, setState] = useState({
    margins,
    value: visibleValue
  });

  const handleScroll = useCallback(event => {
    setScroll({ top: event.scrollTop, left: event.scrollLeft });
  }, []);

  useEffect(() => {
    const node = scrollContainerRef.current;
    node.addEventListener('scroll', handleScroll);
    return () => {
      node.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, handleScroll]);

  return (
    <div {...props} onScroll={handleScroll}>
      {children(state)}
    </div>
  )
};

Scroller.propTypes = {
  rows: PropTypes.shape({
    height: PropTypes.number,
    expanded: PropTypes.bool,
    childrenCount: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  columns: PropTypes.shape({
    width: PropTypes.number,
    expanded: PropTypes.bool,
    childrenCount: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  scrollContainerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  /** Offsets relative to scroll container */
  relativeScroll: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }),
  
  /**
   * Component functions in 2 modes: Dynamic and static.
   * Static involves traversing the columns and rows tree while
   * dynamic fetches the data with 'loadPage' callback relying on children count property of rows and columns meta.
   * */
  value: PropTypes.arrayOf(PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object)
    })),
    children: PropTypes.arrayOf(PropTypes.object)
  })),
  loadPage: PropTypes.func
};

Scroller.defaultProps = {
  defaultHeight: 0,
  defaultWidth: 0,
  relativeScroll: {
    top: 0,
    left: 0
  },
  initialScroll: {
    top: 0,
    left: 0
  },
  rowsPerPage: 40,
  columnsPerPage: 40
};

export default Scroller;