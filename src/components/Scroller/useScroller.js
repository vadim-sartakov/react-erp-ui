import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps
} from './utils';

const getBufferValue = (buffer, page) => buffer.find(item => item && item.page === page);
const addToBuffer = (buffer, value) => getBufferValue(buffer, value.page) ? buffer : [...buffer, value];
/*const cleanBuffer = (buffer, bufferSize) => {
  const nextBuffer = [...buffer];
  if (nextBuffer.length > bufferSize) nextBuffer.shift();
  return nextBuffer;
};
const addToBufferAndClean = (buffer, bufferSize, value) => {
  let nextBuffer = addToBuffer(buffer, value);
  nextBuffer = cleanBuffer(nextBuffer, bufferSize);
  return nextBuffer;
};*/

/**
 * @callback loadRowsPage
 * @param {number} page
 * @param {number} itemsPerPage
 */

/**
 * @callback loadColumnsPage
 * @param {Object} visibleRow
 * @param {number} page
 * @param {number} itemsPerPage
 */

/**
 * @typedef {Object} useScrollerProps
 * @property {number} defaultRowHeight
 * @property {number} defaultColumnWidth
 * @property {number} totalRows
 * @property {number} [totalColumns]
 * @property {number} rowsPerPage
 * @property {number} columnsPerPage
 * @property {number[]} [rows]
 * @property {number[]} [columns]
 * @property {boolean} [async]
 * @property {boolean} [lazy] - When set to true whe height of scroller will expand on demand
 * @property {loadRowsPage} loadRowsPage
 * @property {loadColumnsPage} [loadColumnsPage]
 * @property {number} [fixRows=0]
 * @property {number} [fixColumns=0]
 * @property {number} [bufferSize=3]
 */

/**
 * @typedef {Object} useScrollerResult
 * @property {Object[][]} visibleValues
 * @property {number} rowsStartIndex
 * @property {number} columnsStartIndex
 * @property {import('./Scroller').ScrollerProps} scrollerProps
 */

/**
 * 
 * @param {useScrollerProps} props
 * @return {useScrollerResult} 
 */
const useScroller = ({
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsPerPage,
  columnsPerPage,
  rows,
  columns,
  async,
  lazy,
  loadRowsPage,
  loadColumnsPage,
  fixRows = 0,
  fixColumns = 0,
  bufferSize = 3
}) => {

  const lastRowsPage = useRef(1);
  const [rowsPage, setRowsPage] = useState(0);
  const [columnsPage, setColumnsPage] = useState(0);

  const handleScroll = useCallback(e => {
    const curRowsPage = getPageNumber({
      meta: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    const curColumnsPage = getPageNumber({
      meta: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    if (curRowsPage > lastRowsPage.current) lastRowsPage.current = curRowsPage;
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows]);
  
  const visibleRowsPageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const visibleColumnsPageNumbers = useMemo(() => getVisiblePages(columnsPage), [columnsPage]);

  const rowsStartIndex = visibleRowsPageNumbers[0] * rowsPerPage;
  const columnsStartIndex = visibleColumnsPageNumbers[0] * columnsPerPage; 

  const getLoadingPage = useCallback(rowsPage => {
    if (async) {
      const rowsOnPage = getItemsCountOnPage(rowsPage, rowsPerPage, totalRows);
      return [...new Array(rowsOnPage).keys()].map(() => {
        return totalColumns ? [...new Array(totalColumns).keys()].map(() => ({ isLoading: true })) : { isLoading: true };
      });
    }
  }, [async, totalColumns, rowsPerPage, totalRows]);

  const [loadedValue, setLoadedValue] = useState();
  const buffer = useRef([]);

  useEffect(() => {
    if (async) {
      visibleRowsPageNumbers.reduce(async (prev, visiblePageNumber) => {
        await prev;
        if (!getBufferValue(buffer.current, visiblePageNumber)) {
          const loadResult = await loadRowsPage(visiblePageNumber, rowsPerPage);
          const nextAsyncBuffer = addToBuffer(buffer.current, { page: visiblePageNumber, value: loadResult });
          buffer.current = nextAsyncBuffer;
          setLoadedValue(loadResult);
        }
      }, Promise.resolve());
    }
  }, [
    async,
    visibleRowsPageNumbers,
    rowsPage,
    loadRowsPage,
    getLoadingPage,
    rowsPerPage,
    bufferSize
  ]);

  const visibleRowsPages = useMemo(() => visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
    let page;
    if (async) {
      page = (loadedValue !== undefined && getBufferValue(buffer.current, visiblePageNumber)) || { page: visiblePageNumber, value: getLoadingPage(visiblePageNumber) };
    } else {
      page = getBufferValue(buffer.current, visiblePageNumber) || { page: visiblePageNumber, value: loadRowsPage(visiblePageNumber, rowsPerPage) };
      const nextBuffer = addToBuffer(buffer.current, page);
      buffer.current = nextBuffer;
    };
    return [...acc, page]
  }, []), [async, loadedValue, loadRowsPage, rowsPerPage, visibleRowsPageNumbers, getLoadingPage]);

  const visibleValues = useMemo(() => {
    let scrolledFixedRows; 
    if (!fixRows || rowsStartIndex <= fixRows) {
      scrolledFixedRows = [];
    } else {
      const fixedPages = [];
      // Fetching required amount of pages
      let curPage = 0;
      let bufferValue;
      while((bufferValue = getBufferValue(buffer.current, curPage)) &&
          fixedPages.reduce((acc, page) => acc + (page.value ? page.value.length : 0), 0) < fixRows) {
        fixedPages.push(bufferValue);
        curPage++;
      }
      scrolledFixedRows = fixedPages.reduce((acc, page) => [...acc, ...page.value], []).slice(0, fixRows);
    }

    let visibleValues = visibleRowsPages.reduce((acc, page) => [...acc, ...page.value], scrolledFixedRows);
    if (loadColumnsPage) {
      visibleValues = visibleValues.map(visibleRow => {
        const scrolledFixedColumns = columnsStartIndex > fixColumns ? visibleRow.slice(0, fixColumns) : [];
        return visibleColumnsPageNumbers.reduce((acc, pageNumber) => [...acc, ...loadColumnsPage(visibleRow, pageNumber, columnsPerPage)], scrolledFixedColumns);
      });
    }
    return visibleValues;
  }, [visibleColumnsPageNumbers, loadColumnsPage, columnsPerPage, visibleRowsPages, fixRows, rowsStartIndex, fixColumns, columnsStartIndex]);

  const rowsGaps = useMemo(() => {
    return getGaps({
      meta: rows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage,
      fixed: fixRows
    });
  }, [rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows, fixRows]);

  const lastRowsPageGaps = lazy && getGaps({
    meta: rows,
    defaultSize: defaultRowHeight,
    itemsPerPage: rowsPerPage,
    totalCount: totalRows,
    page: lastRowsPage.current,
    fixed: rowsStartIndex > fixRows ? fixRows : 0
  });

  const columnsGaps = useMemo(() => {
    return totalColumns && getGaps({
      meta: columns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage,
      fixed: fixColumns
    });
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, fixColumns]);

  const coverStyles = {
    height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps && (columnsGaps.start + columnsGaps.middle + columnsGaps.end),
    position: 'relative'
  };
  const pagesStyles = {
    top: rowsGaps.start - (rowsStartIndex > fixRows ? rowsGaps.fixed : 0),
    left: columnsGaps && (columnsGaps.start - (columnsStartIndex > fixColumns ? columnsGaps.fixed : 0)),
    position: 'absolute'
  };
  
  const scrollerProps = {
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    defaultRowHeight,
    defaultColumnWidth,
    rows,
    columns
  };

  return {
    visibleValues,
    rowsStartIndex,
    columnsStartIndex,
    scrollerProps
  };

};

export default useScroller;