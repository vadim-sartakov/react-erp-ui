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
 * @param {import('./').Scroller.useScrollerProps} props
 * @returns {import('./').Scroller.useScrollerResult}
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
  value,
  lazy,
  loadPage,
  renderCell,
  fixRows = 0,
  fixColumns = 0
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

  const coverStyles = useMemo(() => ({
    height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
    width: columnsGaps && (columnsGaps.start + columnsGaps.middle + columnsGaps.end),
    position: 'relative'
  }), [lazy, rowsGaps, columnsGaps, lastRowsPageGaps]);
  const pagesStyles = useMemo(() => {
    const pagesStyles = {
      top: rowsGaps.start - (rowsStartIndex > fixRows ? fixedRowsSize : 0),
      left: columnsGaps && (columnsGaps.start - (columnsStartIndex > fixColumns ? fixedColumnsSize : 0)),
      position: 'absolute'
    };
    return pagesStyles;
  }, [rowsGaps, columnsGaps, columnsStartIndex, fixColumns, fixRows, fixedColumnsSize, fixedRowsSize, rowsStartIndex]);

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

  const elements = useMemo(() => renderCell && visibleRows.reduce((acc, visibleRow) => {
    const row = nextRows && nextRows[visibleRow];
    if (visibleColumns) {
      const columnsElements = visibleColumns.map(visibleColumn => {
        const column = nextColumns && nextColumns[visibleColumn];
        const valueArray = loadedValues || value;
        const curValue = valueArray[visibleRow] && valueArray[visibleRow][visibleColumn];
        return renderCell({ rowIndex: visibleRow, columnIndex: visibleColumn, row, column, value: curValue });
      });
      return [...acc, ...columnsElements];
    } else {
      const valueArray = loadedValues || value;
      const curValue = valueArray[visibleRow];
      const rowElement = renderCell({ rowIndex: visibleRow, row, value: curValue });
      return [...acc, rowElement];
    }
  }, []), [nextRows, nextColumns, renderCell, visibleRows, visibleColumns, loadedValues, value]);

  const scrollerContainerProps = {
    onScroll: handleScroll,
    coverStyles,
    pagesStyles,
    defaultRowHeight,
    defaultColumnWidth
  };

  return {
    rows: nextRows,
    columns: nextColumns,
    visibleRows,
    visibleColumns,
    loadedValues,
    rowsStartIndex,
    columnsStartIndex,
    gridStyles,
    elements,
    scrollerContainerProps
  };

};

export default useScroller;