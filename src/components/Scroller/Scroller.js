import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

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

const Scroller = ({
  scrollTop,
  scrollLeft,
  columns,
  rows,
  defaultRowHeight,
  defaultColumnWidth,
  columnsPerPage,
  rowsPerPage,
  loadPage,
  totalColumns,
  totalRows,
  children,
  ...props
}) => {
  const rootRef = useRef();

  useEffect(() => {
    if (rootRef.current) rootRef.current.scrollTop = scrollTop
  }, [scrollTop]);
  useEffect(() => {
    if (rootRef.current) rootRef.current.scrollLeft = scrollLeft
  }, [scrollLeft]);

  const getPagedValueAndPaddings = (scrollTop, scrollLeft) => {
    const [visibleColumns, horizontalGaps] = getVisiblePagesAndPaddings({
      scroll: scrollLeft,
      entries: columns,
      itemsPerPage: columnsPerPage,
      defaultSize: defaultColumnWidth,
      totalCount: totalColumns
    });
    const [visibleRows, verticalGaps] = getVisiblePagesAndPaddings({
      scroll: scrollTop,
      entries: rows,
      itemsPerPage: rowsPerPage,
      defaultSize: defaultRowHeight,
      totalCount: totalRows,
    });
    const pagedValue = applyVisiblePages({
      visibleColumns,
      visibleRows,
      columnsPerPage,
      rowsPerPage,
      rows
    });
    return {
      pagedValue,
      gaps: {
        top: verticalGaps.start,
        bottom: verticalGaps.end,
        left: horizontalGaps.start,
        right: horizontalGaps.end
      }
    };
  };

  const [state, setState] = useState(() => {
    const initialState = getPagedValueAndPaddings(scrollTop, scrollLeft);
    return initialState;
  });

  const handleScroll = event => {
    const nextState = getPagedValueAndPaddings(event.scrollTop, event.scrollLeft);
    setState(nextState);
  };

  const gaps = {
    top: state.gaps.top,
    bottom: state.gaps.bottom,
    left: state.gaps.left,
    right: state.gaps.right
  };

  // Should calculate paddings
  return state.pagedValue ? (
    <div {...props} ref={rootRef} onScroll={handleScroll}>
      {children(state.pagedValue, gaps)}
    </div>
  ) : null
};

Scroller.propTypes = {
  scrollTop: PropTypes.number,
  scrollLeft: PropTypes.number,
  columns: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  })),
  rows: PropTypes.arrayOf(PropTypes.shape({
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  })),
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  
  /**
   * Component functions in 2 modes: Dynamic and static
   * static involves traversing the columns and rows tree while
   * dynamic fetches the data with 'loadPage' callback. With this mode total rows and column
   * got to be specified.
   * */
  loadPage: PropTypes.func,
  totalRows: PropTypes.number,
  totalColumns: PropTypes.number,
};

Scroller.defaultProps = {
  defaultHeight: 0,
  defaultWidth: 0,
  scrollTop: 0,
  scrollLeft: 0,
  rowsPerPage: 40,
  columnsPerPage: 40
};

export default Scroller;