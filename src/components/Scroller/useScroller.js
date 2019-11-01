import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps,
  getFixedOffsets
} from './utils';

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
 * @property {number[]} rowsOffsets
 * @property {number[]} columnsOffsets
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

  const [lastRowsPage, setLastRowsPage] = useState(1);
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
    setLastRowsPage(lastRowsPage => curRowsPage > lastRowsPage ? curRowsPage : lastRowsPage);
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [
    columns,
    columnsPage,
    columnsPerPage,
    defaultColumnWidth,
    totalColumns,
    rows,
    rowsPage,
    rowsPerPage,
    defaultRowHeight,
    totalRows
  ]);
  
  const visibleRowsPageNumbers = useMemo(() => getVisiblePages(rowsPage), [rowsPage]);
  const visibleColumnsPageNumbers = useMemo(() => getVisiblePages(columnsPage), [columnsPage]);

  const rowsStartIndex = visibleRowsPageNumbers[0] * rowsPerPage;
  const columnsStartIndex = visibleColumnsPageNumbers[0] * columnsPerPage; 

  const [buffer, setBuffer] = useState([]);

  useEffect(() => {
    if (async) {
      const loadPages = async () => {
        for (let i = 0; i < visibleRowsPageNumbers.length; i++) {
          const visiblePageNumber = visibleRowsPageNumbers[i];
          setBuffer(buffer => {
            if (buffer[visiblePageNumber]) return buffer;
            loadRowsPage(visiblePageNumber, rowsPerPage).then(loadResult => {
              setBuffer(buffer => {
                const nextBuffer = [...buffer];
                nextBuffer[visiblePageNumber] = loadResult;
                return nextBuffer;
              });
            });
            return buffer;
          });
        }
      }
      loadPages();
    }
  }, [
    async,
    visibleRowsPageNumbers,
    rowsPage,
    loadRowsPage,
    rowsPerPage,
    bufferSize
  ]);

  const visibleRowsPages = useMemo(() => visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
    let page;
    if (async) {
      const getLoadingPage = () => {
        const rowsOnPage = getItemsCountOnPage(visiblePageNumber, rowsPerPage, totalRows);
        return [...new Array(rowsOnPage).keys()].map(() => {
          return totalColumns ? [...new Array(totalColumns).keys()].map(() => ({ isLoading: true })) : { isLoading: true };
        });
      }
      page = buffer[visiblePageNumber] || getLoadingPage();
    } else {
      page = loadRowsPage(visiblePageNumber, rowsPerPage);
    };
    return [...acc, page]
  }, []), [async, buffer, loadRowsPage, rowsPerPage, visibleRowsPageNumbers, totalColumns, totalRows]);

  const visibleValues = useMemo(() => {
    let scrolledFixedRows; 
    if (!fixRows || rowsStartIndex <= fixRows) {
      scrolledFixedRows = [];
    } else {
      const fixedPages = [];
      // Fetching required amount of pages
      let curPage = 0;
      let bufferValue;
      while((bufferValue = async ? buffer[curPage] : loadRowsPage(curPage, rowsPerPage)) &&
          fixedPages.reduce((acc, page) => acc + page.length, 0) < fixRows) {
        fixedPages.push(bufferValue);
        curPage++;
      }
      scrolledFixedRows = fixedPages.reduce((acc, page) => [...acc, ...page], []).slice(0, fixRows);
    }

    let visibleValues = visibleRowsPages.reduce((acc, page) => [...acc, ...page], scrolledFixedRows);
    if (loadColumnsPage) {
      visibleValues = visibleValues.map(visibleRow => {
        const scrolledFixedColumns = columnsStartIndex > fixColumns ? visibleRow.slice(0, fixColumns) : [];
        return visibleColumnsPageNumbers.reduce((acc, pageNumber) => [...acc, ...loadColumnsPage(visibleRow, pageNumber, columnsPerPage)], scrolledFixedColumns);
      });
    }
    return visibleValues;
  }, [
    async,
    buffer,
    loadRowsPage,
    rowsPerPage,
    visibleColumnsPageNumbers,
    loadColumnsPage,
    columnsPerPage,
    visibleRowsPages,
    fixRows,
    rowsStartIndex,
    fixColumns,
    columnsStartIndex
  ]);

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

  const lastRowsPageGaps = useMemo(() => lazy && getGaps({
    meta: rows,
    defaultSize: defaultRowHeight,
    itemsPerPage: rowsPerPage,
    totalCount: totalRows,
    page: lastRowsPage,
    fixed: fixRows
  }), [lazy, rows, lastRowsPage, rowsPerPage, defaultRowHeight, totalRows, fixRows]);

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

  const rowsOffsets = useMemo(() => fixRows ? getFixedOffsets({ meta: rows, defaultSize: defaultRowHeight, fixed: fixRows }) : [], [fixRows, defaultRowHeight, rows]);
  const columnsOffsets = useMemo(() => fixColumns ? getFixedOffsets({ meta: columns, defaultSize: defaultColumnWidth, fixed: fixColumns }) : [], [fixColumns, defaultColumnWidth, columns]);
  
  const scrollerProps = {
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    defaultRowHeight,
    defaultColumnWidth,
    rows,
    columns,
    rowsOffsets,
    columnsOffsets
  };

  return {
    visibleValues,
    rowsStartIndex,
    columnsStartIndex,
    scrollerProps
  };

};

export default useScroller;