import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  getVisiblePages,
  getItemsCountOnPage,
  getPageNumber,
  getGaps,
  getFixedOffsets,
  getScrollPages
} from './utils';

const useScroller = ({
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsPerPage,
  columnsPerPage,
  rows,
  columns,
  lazy,
  loadPage,
  fixRows = 0,
  fixColumns = 0
}) => {

  const [lastRowsPage, setLastRowsPage] = useState(1);
  const [rowsPage, setRowsPage] = useState(0);
  const [columnsPage, setColumnsPage] = useState(0);

  const rowsScrollPages = useMemo(() => {
    return rows && getScrollPages({ meta: rows, totalCount: totalRows, defaultSize: defaultRowHeight, itemsPerPage: rowsPerPage });
  }, [
    rows,
    totalRows,
    defaultRowHeight,
    rowsPerPage
  ]);
  const columnsScrollPages = useMemo(() => {
    return columns && getScrollPages({ meta: columns, totalCount: totalColumns, defaultSize: defaultColumnWidth, itemsPerPage: columnsPerPage });
  }, [
    columns,
    totalColumns,
    defaultColumnWidth,
    columnsPerPage
  ]);

  const handleScroll = useCallback(e => {
    const curRowsPage = getPageNumber({
      scrollPages: rowsScrollPages,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    const curColumnsPage = getPageNumber({
      scrollPages: columnsScrollPages,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    setLastRowsPage(lastRowsPage => curRowsPage > lastRowsPage ? curRowsPage : lastRowsPage);
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [
    columnsPage,
    columnsPerPage,
    defaultColumnWidth,
    totalColumns,
    rowsPage,
    rowsPerPage,
    defaultRowHeight,
    totalRows,
    rowsScrollPages,
    columnsScrollPages
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
    const result = visibleIndexes.reduce((acc, item) => [...acc, ...item], []);
    if (shouldRenderFixed) result.splice(fix, fix)
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
    if (loadPage) {
      const loadPages = async () => {
        for (let i = 0; i < visibleRowsPageNumbers.length; i++) {
          const visiblePageNumber = visibleRowsPageNumbers[i];
          setBuffer(buffer => {
            if (buffer[visiblePageNumber]) return buffer;
            const onLoad = loadResult => {
              setBuffer(buffer => {
                const nextBuffer = [...buffer];
                nextBuffer[visiblePageNumber] = loadResult;
                return nextBuffer;
              });
            };
            loadPage(visiblePageNumber, rowsPerPage).then(onLoad);
            return buffer;
          });
        }
      }
      loadPages();
    }
  }, [visibleRowsPageNumbers, rowsPage, loadPage, rowsPerPage]);

  const loadedValues = useMemo(() => loadPage && buffer.reduce((acc, page, index) => {
    const curPage = page || [...new Array(getItemsCountOnPage(index, rowsPerPage, totalRows)).fill()];
    return [...acc, ...curPage];
  }, []), [loadPage, buffer, rowsPerPage, totalRows]);

  const rowsGaps = useMemo(() => {
    return getGaps({
      meta: rows,
      scrollPages: rowsScrollPages,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage,
      fixCount: fixRows
    });
  }, [fixRows, rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows, rowsScrollPages]);

  const lastRowsPageGaps = useMemo(() => lazy && getGaps({
    meta: rows,
    defaultSize: defaultRowHeight,
    itemsPerPage: rowsPerPage,
    totalCount: totalRows,
    page: lastRowsPage,
    fixCount: fixRows
  }), [lazy, rows, fixRows, lastRowsPage, rowsPerPage, defaultRowHeight, totalRows]);

  const columnsGaps = useMemo(() => {
    return totalColumns && getGaps({
      meta: columns,
      scrollPages: columnsScrollPages,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage,
      fixCount: fixColumns
    });
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, fixColumns, columnsScrollPages]);

  const coverStyles = useMemo(() => ({
    height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps && (columnsGaps.start + columnsGaps.middle + columnsGaps.end),
    position: 'relative'
  }), [lazy, rowsGaps, columnsGaps, lastRowsPageGaps]);
  const pagesStyles = useMemo(() => {
    return {
      top: rowsGaps.start,
      left: columnsGaps && columnsGaps.start,
      position: 'absolute'
    };
  }, [rowsGaps, columnsGaps]);

  const gridStyles = useMemo(() => totalColumns && {
    display: 'inline-grid',
    gridTemplateColumns: `repeat(${visibleColumns.length}, auto)`
  }, [totalColumns, visibleColumns]);

  const rowsOffsets = useMemo(() => fixRows ? getFixedOffsets({ meta: rows, defaultSize: defaultRowHeight, fixed: fixRows }) : [], [fixRows, defaultRowHeight, rows]);
  const columnsOffsets = useMemo(() => fixColumns ? getFixedOffsets({ meta: columns, defaultSize: defaultColumnWidth, fixed: fixColumns }) : [], [fixColumns, defaultColumnWidth, columns]);
  
  const nextRows = useMemo(() => {
    const rowsMeta = rows || [];
    const nextRows = [...new Array(Math.max(rowsMeta.length, rowsOffsets.length)).keys()];
    return nextRows.map((key, index) => ({ ...rowsMeta[index], offset: rowsOffsets[index]} ));
  }, [rows, rowsOffsets]);

  const nextColumns = useMemo(() => {
    const columnsMeta = columns || [];
    const nextColumns = [...new Array(Math.max(columnsMeta.length, columnsOffsets.length)).keys()];
    return nextColumns.map((key, index) => ({ ...columnsMeta[index], offset: columnsOffsets[index]} ));
  }, [columns, columnsOffsets]);

  return {
    rows: nextRows,
    columns: nextColumns,
    visibleRows,
    visibleColumns,
    loadedValues,
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    gridStyles
  };

};

export default useScroller;