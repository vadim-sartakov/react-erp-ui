import React, { useState, useRef, useEffect, Children } from 'react';
import PropTypes from 'prop-types';

const defaultLoadPage = (value, rowPage, visibleColumns, columnsPerPage, rowsPerPage) => {
  const rows = value.slice(rowPage * rowsPerPage, (rowPage + 1) * rowsPerPage);
  // TODO: Remove hidden columns from values
  return rows
};

const applyVisiblePages = (value, visibleColumns, visibleRows, columnsPerPage, rowsPerPage) => {
  const result = [];
  const firstPage = defaultLoadPage(value, visibleRows.pages[0], visibleColumns, columnsPerPage, rowsPerPage);
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
    const secondPage = defaultLoadPage(value, visibleRows.pages[1], visibleColumns, columnsPerPage, rowsPerPage);
    result.push(...secondPage);
  }

  return result;
};

const getVisiblePagesAndPaddings = (scroll, meta, defaultSize, itemsPerPage) => {
  let page = 0, visiblePages = {}, startSectionSize = 0, viewingPagesSize = 0, endSectionSize = 0;

  if (!meta.children) {
    const pageSize = defaultSize * itemsPerPage;
    page = Math.floor( ( scroll + pageSize / 2 ) / pageSize);
    startSectionSize = page * pageSize;

    const itemsOnFirstPage = Math.min(meta.totalCount, itemsPerPage);
    const itemsOnSecondPage = Math.min(meta.totalCount - itemsOnFirstPage, itemsPerPage);

    viewingPagesSize += (itemsOnFirstPage + itemsOnSecondPage) * defaultSize;
    endSectionSize = defaultSize * meta.totalCount - startSectionSize - viewingPagesSize;
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
        const [nestedVisiblePages, nestedPaddings] = getVisiblePagesAndPaddings(scroll - curScroll, meta.children, defaultSize, itemsOnPage);
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
  style = {},
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

  const getPagedValueAndPaddings = (scrollLeft, scrollTop) => {
    const { visiblePages: visibleColumns, paddings: horizontalPaddings } = getVisiblePagesAndPaddings(scrollLeft, columns, columnsPerPage, defaultColumnWidth);
    const { visiblePages: visibleRows, paddings: verticalPaddings } = getVisiblePagesAndPaddings(scrollTop, rows, rowsPerPage, defaultRowHeight);
    const pagedValue = applyVisiblePages(visibleColumns, visibleRows, value);
    return {
      pagedValue,
      paddings: { ...horizontalPaddings, ...verticalPaddings }
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

  const nextStyle = {
    ...style,
    paddingTop: state.paddings.top,
    paddingBottom: state.paddings.bottom,
    paddingLeft: state.paddings.left,
    paddingRight: state.paddings.right
  };

  // Should calculate paddings
  return state.pagedValue ? (
    <div {...props} ref={rootRef} style={nextStyle} onScroll={handleScroll}>
      {Children.only(children(state.pagedValue))}
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
  }).isRequired,
  rows: PropTypes.shape({
    totalCount: PropTypes.number,
    size: PropTypes.number,
    expanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
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