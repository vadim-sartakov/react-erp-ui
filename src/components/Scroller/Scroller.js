import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const defaultLoadPage = ({ value, rowPage, visibleColumns, columnsPerPage, rowsPerPage }) => {
  const rows = value.slice(rowPage * rowsPerPage, (rowPage + 1) * rowsPerPage);
  // TODO: Remove hidden columns from values
  return rows
};

const applyVisiblePages = ({ value, visibleColumns, visibleRows, columnsPerPage, rowsPerPage }) => {
  const result = [];
  const firstPage = defaultLoadPage({ value, rowPage: visibleRows.pages[0], visibleColumns, columnsPerPage, rowsPerPage });
  result.push(...firstPage);

  if (visibleRows.children) {
    const entries = Object.entries(visibleRows);

    for (let index = 0; index < entries.length; index++) {
      const [childIndex, childVisiblePages] = entries[index];
      const nestedValue = applyVisiblePages(value.children[childIndex], visibleColumns, childVisiblePages, columnsPerPage, rowsPerPage);
      // Does it mutate origin object?
      result[childIndex].chilren = nestedValue;
    }
  }

  if (visibleRows.pages[1]) {
    const secondPage = defaultLoadPage({ value, rowPage: visibleRows.pages[1], visibleColumns, columnsPerPage, rowsPerPage });
    result.push(...secondPage);
  }

  return result;
};

const getVisiblePagesAndPaddings = ({ scroll, meta, value, defaultSize, itemsPerPage }) => {
  let page = 0, visiblePages = {}, startSectionSize = 0, viewingPagesSize = 0, endSectionSize = 0;

  if (!meta || !meta.children) {
    const pageSize = defaultSize * itemsPerPage;
    page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);

    visiblePages.pages = page === 0 ? [page] : [page - 1, page];
    startSectionSize = visiblePages.pages[0] * pageSize;

    const totalCount = value.length || meta.totalCount;
    const itemsOnFirstPage = Math.min(totalCount, itemsPerPage);
    const itemsOnSecondPage = page > 0 ? Math.min(totalCount - (page * itemsPerPage), itemsPerPage) : 0;

    viewingPagesSize += (itemsOnFirstPage + itemsOnSecondPage) * defaultSize;
    endSectionSize = defaultSize * totalCount - startSectionSize - viewingPagesSize;
  } else {
    
    let curScroll = 0, itemsOnPage = 0;
    for (let index = 0; index < meta.children.length; index++) {
      if (curScroll >= scroll) break;
      const curMeta = meta.children[index];
      const size = curMeta.size || defaultSize;
  
      if (curScroll < scroll) {
        const isNextPage = index > 0 && index % itemsPerPage === 0;
        scroll = curScroll + size;
        page = isNextPage ? page + 1 : page;
        itemsOnPage = isNextPage ? 0 : itemsOnPage + 1;
        startSectionSize += size;
      }
  
      if (curMeta.expanded) {
        const [nestedVisiblePages, nestedPaddings] = getVisiblePagesAndPaddings(scroll - curScroll, meta.children, value, defaultSize, itemsOnPage);
        if (!visiblePages.children) visiblePages.children = [];
        visiblePages.children.push({ [index]: nestedVisiblePages });
        startSectionSize += nestedPaddings.start;
        endSectionSize += nestedPaddings.end;
      }
      
    }

  }

  visiblePages.pages = page === 0 ? [page] : [page - 1, page];

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
  children,
  value,
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
    const [visibleColumns, horizontalPaddings] = getVisiblePagesAndPaddings({
      scroll: scrollLeft,
      meta: columns,
      itemsPerPage: columnsPerPage,
      defaultSize: defaultColumnWidth,
      value: Object.entries(value[0]),
    });
    const [visibleRows, verticalPaddings] = getVisiblePagesAndPaddings({
      scroll: scrollTop,
      meta: rows,
      itemsPerPage: rowsPerPage,
      defaultSize: defaultRowHeight,
      value,
    });
    const pagedValue = applyVisiblePages({
      visibleColumns,
      visibleRows,
      columnsPerPage,
      rowsPerPage,
      value
    });
    return {
      pagedValue,
      paddings: {
        top: verticalPaddings.start,
        bottom: verticalPaddings.end,
        left: horizontalPaddings.start,
        right: horizontalPaddings.end
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

  const margins = {
    top: state.paddings.top,
    bottom: state.paddings.bottom,
    left: state.paddings.left,
    right: state.paddings.right
  };

  // Should calculate paddings
  return state.pagedValue ? (
    <div {...props} ref={rootRef} onScroll={handleScroll}>
      {children(state.pagedValue, margins)}
    </div>
  ) : null
};

Scroller.propTypes = {
  scrollTop: PropTypes.number,
  scrollLeft: PropTypes.number,
  columns: PropTypes.shape({
    totalCount: PropTypes.number,
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  rows: PropTypes.shape({
    totalCount: PropTypes.number,
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }),
  defaultColumnWidth: PropTypes.number.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  columnsPerPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  loadPage: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.object).isRequired
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