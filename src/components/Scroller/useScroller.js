import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps,
  getFixedOffsets,
  getItemsSize
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
 * @property {number} [fixRows=0]
 * @property {number} [fixColumns=0]
 * @property {number} [bufferSize=3]
 */

/**
 * @typedef {Object} VisibleValue
 * @property {number} index
 * @property {*} value
 */

/**
 * @typedef {Object} useScrollerResult
 * @property {VisibleValue[]} visibleValues
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

  const rowsStartIndex = useMemo(() => visibleRowsPageNumbers[0] * rowsPerPage, [visibleRowsPageNumbers, rowsPerPage]);
  const columnsStartIndex = useMemo(() => visibleColumnsPageNumbers[0] * columnsPerPage, [visibleColumnsPageNumbers, columnsPerPage]); 

  const getVisibleIndexes = useCallback(({
    fix,
    visiblePageNumbers,
    itemsPerPage,
    totalCount,
    startIndex
  }) => {
    const shouldRenderFixed = startIndex > fix;
    const fixedIndexes = [new Array(fix).keys()];
    const visibleIndexes = visiblePageNumbers.reduce((acc, pageNumber) => {
      const itemsCount = getItemsCountOnPage(pageNumber, itemsPerPage, totalCount);
      const pageIndexes = [...new Array(itemsCount).keys()].map(index => pageNumber * itemsPerPage + index);
      return [...acc, pageIndexes];
    }, shouldRenderFixed ? fixedIndexes : []);
    const result = visibleIndexes.reduce((acc, item) => [...acc, ...item], [])
    return result;
  }, []);

  const visibleRows = useMemo(() => getVisibleIndexes({
    startIndex: rowsStartIndex,
    fix: fixRows,
    visiblePageNumbers: visibleRowsPageNumbers,
    itemsPerPage: rowsPerPage,
    totalCount: totalRows
  }), [rowsStartIndex, fixRows, visibleRowsPageNumbers, rowsPerPage, totalRows, getVisibleIndexes]);

  const visibleColumns = useMemo(() => totalColumns && getVisibleIndexes({
    startIndex: columnsStartIndex,
    fix: fixColumns,
    visiblePageNumbers: visibleColumnsPageNumbers,
    itemsPerPage: columnsPerPage,
    totalCount: totalColumns
  }), [columnsStartIndex, fixColumns, visibleColumnsPageNumbers, columnsPerPage, totalColumns, getVisibleIndexes]);

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

  const scrolledFixedRows = useMemo(() => {
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
    return scrolledFixedRows;
  }, [async, buffer, fixRows, loadRowsPage, rowsPerPage, rowsStartIndex]);

  const visibleValues = useMemo(() => {
    const visibleRowsPages = visibleRowsPageNumbers.reduce((acc, visiblePageNumber) => {
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
      const result = [...acc];
      const nextIndex = visiblePageNumber * rowsPerPage - scrolledFixedRows.length;
      result[nextIndex] = undefined;
      result.splice(nextIndex, 0, ...page);
      return result;
    }, []);
    return [...scrolledFixedRows, ...visibleRowsPages];
  }, [
    async,
    buffer,
    loadRowsPage,
    rowsPerPage,
    visibleRowsPageNumbers,
    totalColumns,
    totalRows,
    scrolledFixedRows
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

  const fixedRowsSize = useMemo(() => getItemsSize({ meta: rows, count: fixRows, defaultSize: defaultRowHeight }), [rows, fixRows, defaultRowHeight]);
  const fixedColumnsSize = useMemo(() => getItemsSize({ meta: columns, count: fixColumns, defaultSize: defaultColumnWidth }), [columns, fixColumns, defaultColumnWidth]);

  const coverStyles = {
    height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps && (columnsGaps.start + columnsGaps.middle + columnsGaps.end),
    position: 'relative'
  };
  const pagesStyles = {
    top: rowsGaps.start - (rowsStartIndex > fixRows ? fixedRowsSize : 0),
    left: columnsGaps && (columnsGaps.start - (columnsStartIndex > fixColumns ? fixedColumnsSize : 0)),
    position: 'absolute'
  };

  const rowsOffsets = useMemo(() => fixRows ? getFixedOffsets({ meta: rows, defaultSize: defaultRowHeight, fixed: fixRows }) : [], [fixRows, defaultRowHeight, rows]);
  const columnsOffsets = useMemo(() => fixColumns ? getFixedOffsets({ meta: columns, defaultSize: defaultColumnWidth, fixed: fixColumns }) : [], [fixColumns, defaultColumnWidth, columns]);
  
  const scrollerProps = {
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    defaultRowHeight,
    defaultColumnWidth
  };

  return {
    visibleRows,
    visibleColumns,
    visibleValues,
    rowsStartIndex,
    columnsStartIndex,
    rowsOffsets,
    columnsOffsets,
    scrollerProps
  };

};

export default useScroller;