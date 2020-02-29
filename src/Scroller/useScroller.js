import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getCustomSizesTotal,
  getScrollDataWithDefaultSize,
  getScrollDataWithCustomSizes,
  shiftScroll,
  getItemsSize
} from './utils';

const defaultArray = [];

/**
 * @param {import('.').UseScrollerOptions} options
 * @returns {import('.').UseScrollerResult}
 */
const useScroller = ({
  lazy,
  defaultRowHeight,
  defaultColumnWidth,
  totalRows,
  totalColumns,
  rowsSizes = defaultArray,
  columnsSizes = defaultArray,
  width,
  height,
  overscroll = 0
}) => {

  const scrollerContainerRef = useRef();

  const focusCell = useCallback(cell => {

  }, []);

  const [containerSizes, setContainerSizes] = useState({ width, height });
  useEffect(() => {
    const scrollerContainerRect = scrollerContainerRef.current.getBoundingClientRect();
    setContainerSizes({ width: scrollerContainerRect.width, height: scrollerContainerRect.height });
  }, []);

  const [columnsScrollData, setColumnsScrollData] = useState(() => {
    if (!totalColumns) return;
    const containerSize = containerSizes.width;
    if (columnsSizes.length) {
      return getScrollDataWithCustomSizes({ scroll: 0, sizes: columnsSizes, containerSize, defaultSize: defaultColumnWidth, totalCount: totalColumns, overscroll });
    } else {
      return getScrollDataWithDefaultSize({ scroll: 0, containerSize, defaultSize: defaultColumnWidth, totalCount: totalColumns, overscroll })
    }
  });

  const [rowsScrollData, setRowsScrollData] = useState(() => {
    const containerSize = containerSizes.height;
    if (rowsSizes.length) {
      return getScrollDataWithCustomSizes({ scroll: 0, sizes: rowsSizes, containerSize, defaultSize: defaultRowHeight, totalCount: totalRows, overscroll });
    } else {
      return getScrollDataWithDefaultSize({ scroll: 0, containerSize, defaultSize: defaultRowHeight, totalCount: totalRows, overscroll })
    }
  });

  const prevScrollTop = useRef(0);
  const prevScrollLeft = useRef(0);

  const handleScroll = useCallback(e => {
    let nextRowsScrollData, nextColumnsScrollData
    if (totalColumns) {
      if (columnsSizes.length) {
        nextColumnsScrollData = shiftScroll({
          prevScrollData: columnsScrollData,
          prevScroll: prevScrollLeft.current,
          sizes: columnsSizes,
          scroll: e.target.scrollLeft,
          containerSize: containerSizes.width,
          totalCount: totalColumns,
          defaultSize: defaultColumnWidth,
          overscroll
        });
      } else {
        nextColumnsScrollData = getScrollDataWithDefaultSize({
          containerSize: containerSizes.width,
          defaultSize: defaultColumnWidth,
          totalCount: totalColumns,
          scroll: e.target.scrollLeft,
          overscroll
        });
      }
      setColumnsScrollData(nextColumnsScrollData);
    }
    
    if (rowsSizes.length) {
      nextRowsScrollData = shiftScroll({
        prevScrollData: rowsScrollData,
        prevScroll: prevScrollTop.current,
        sizes: rowsSizes,
        scroll: e.target.scrollTop,
        containerSize: containerSizes.height,
        totalCount: totalRows,
        defaultSize: defaultRowHeight,
        overscroll
      });
    } else {
      nextRowsScrollData = getScrollDataWithDefaultSize({
        containerSize: containerSizes.height,
        defaultSize: defaultRowHeight,
        totalCount: totalRows,
        scroll: e.target.scrollTop,
        overscroll
      });
    }
    setRowsScrollData(nextRowsScrollData);

    prevScrollTop.current = e.target.scrollTop;
    prevScrollLeft.current = e.target.scrollLeft;
  }, [
    rowsScrollData,
    columnsScrollData,
    columnsSizes,
    rowsSizes,
    containerSizes.height,
    containerSizes.width,
    defaultColumnWidth,
    defaultRowHeight,
    overscroll,
    totalRows,
    totalColumns
  ]);

  const visibleRowsSize = useMemo(() => {
    return lazy ?
      getItemsSize({
        startIndex: rowsScrollData.visibleIndexes[0],
        sizes: rowsSizes,
        defaultSize: defaultRowHeight,
        count: rowsScrollData.visibleIndexes.length
      }) : 0;
  }, [lazy, rowsScrollData, rowsSizes, defaultRowHeight]);

  const coverWidth = useMemo(() => {
    if (!totalColumns) return;
    if (columnsSizes.length) {
      return getCustomSizesTotal({ sizes: columnsSizes, totalCount: totalColumns, defaultSize: defaultColumnWidth });
    } else {
      return totalColumns * defaultColumnWidth;
    }
  }, [columnsSizes, defaultColumnWidth, totalColumns]);

  const coverHeight = useMemo(() => {
    if (rowsSizes.length) {
      return getCustomSizesTotal({ sizes: rowsSizes, totalCount: totalRows, defaultSize: defaultRowHeight });
    } else {
      return totalRows * defaultRowHeight;
    }
  }, [rowsSizes, defaultRowHeight, totalRows]);

  const coverStyles = useMemo(() => {
    return {
      height: lazy ? rowsScrollData.offset + visibleRowsSize : coverHeight,
      width: coverWidth,
      position: 'relative'
    }
  }, [lazy, coverHeight, coverWidth, rowsScrollData.offset, visibleRowsSize]);

  const pagesStyles = useMemo(() => {
    return {
      top: rowsScrollData.offset,
      left: columnsScrollData && columnsScrollData.offset,
      position: 'absolute'
    };
  }, [rowsScrollData.offset, columnsScrollData]);

  return {
    scrollerContainerRef,
    focusCell,
    visibleRowsIndexes: rowsScrollData.visibleIndexes,
    visibleColumnsIndexes: columnsScrollData && columnsScrollData.visibleIndexes,
    onScroll: handleScroll,
    coverStyles,
    pagesStyles
  };

};

export default useScroller;