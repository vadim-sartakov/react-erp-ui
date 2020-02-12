import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _regeneratorRuntime from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/regenerator";
import _asyncToGenerator from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/asyncToGenerator";
import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { useEffect, useState, useMemo, useCallback } from 'react';
import { getVisiblePages, getItemsCountOnPage, getPageNumber, getGaps, getFixedOffsets, getScrollPages, getItemsSize } from './utils';
/**
 * @param {import('.').UseScrollerOptions} options
 * @returns {import('.').UseScrollerResult}
 */

var useScroller = function useScroller(_ref) {
  var scrollerContainerRef = _ref.scrollerContainerRef,
      scroll = _ref.scroll,
      defaultRowHeight = _ref.defaultRowHeight,
      defaultColumnWidth = _ref.defaultColumnWidth,
      totalRows = _ref.totalRows,
      totalColumns = _ref.totalColumns,
      rowsPerPage = _ref.rowsPerPage,
      columnsPerPage = _ref.columnsPerPage,
      rows = _ref.rows,
      columns = _ref.columns,
      lazy = _ref.lazy,
      loadPage = _ref.loadPage,
      _ref$fixRows = _ref.fixRows,
      fixRows = _ref$fixRows === void 0 ? 0 : _ref$fixRows,
      _ref$fixColumns = _ref.fixColumns,
      fixColumns = _ref$fixColumns === void 0 ? 0 : _ref$fixColumns;
  useEffect(function () {
    if (scroll) {
      if (scroll.top !== undefined) scrollerContainerRef.current.scrollTop = scroll.top;
      if (scroll.left !== undefined) scrollerContainerRef.current.scrollLeft = scroll.left;
    }
  }, [scrollerContainerRef, scroll]);

  var _useState = useState(1),
      _useState2 = _slicedToArray(_useState, 2),
      lastRowsPage = _useState2[0],
      setLastRowsPage = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      rowsPage = _useState4[0],
      setRowsPage = _useState4[1];

  var _useState5 = useState(0),
      _useState6 = _slicedToArray(_useState5, 2),
      columnsPage = _useState6[0],
      setColumnsPage = _useState6[1];

  var rowsScrollPages = useMemo(function () {
    return rows && getScrollPages({
      meta: rows,
      totalCount: totalRows,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage
    });
  }, [rows, totalRows, defaultRowHeight, rowsPerPage]);
  var columnsScrollPages = useMemo(function () {
    return columns && getScrollPages({
      meta: columns,
      totalCount: totalColumns,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage
    });
  }, [columns, totalColumns, defaultColumnWidth, columnsPerPage]);
  var handleScroll = useCallback(function (e) {
    var curRowsPage = getPageNumber({
      scrollPages: rowsScrollPages,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      scroll: e.target.scrollTop
    });
    var curColumnsPage = getPageNumber({
      scrollPages: columnsScrollPages,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      scroll: e.target.scrollLeft
    });
    setLastRowsPage(function (lastRowsPage) {
      return curRowsPage > lastRowsPage ? curRowsPage : lastRowsPage;
    });
    if (rowsPage !== curRowsPage) setRowsPage(curRowsPage);
    if (columnsPage !== curColumnsPage) setColumnsPage(curColumnsPage);
  }, [columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, rowsPage, rowsPerPage, defaultRowHeight, totalRows, rowsScrollPages, columnsScrollPages]);
  var visibleRowsPageNumbers = useMemo(function () {
    return getVisiblePages(rowsPage);
  }, [rowsPage]);
  var visibleColumnsPageNumbers = useMemo(function () {
    return getVisiblePages(columnsPage);
  }, [columnsPage]);
  var rowsStartIndex = useMemo(function () {
    return visibleRowsPageNumbers[0] * rowsPerPage;
  }, [visibleRowsPageNumbers, rowsPerPage]);
  var columnsStartIndex = useMemo(function () {
    return visibleColumnsPageNumbers[0] * columnsPerPage;
  }, [visibleColumnsPageNumbers, columnsPerPage]);
  var getVisibleIndexes = useCallback(function (_ref2) {
    var fix = _ref2.fix,
        visiblePageNumbers = _ref2.visiblePageNumbers,
        itemsPerPage = _ref2.itemsPerPage,
        totalCount = _ref2.totalCount,
        startIndex = _ref2.startIndex;
    var shouldRenderFixed = startIndex > fix;
    var fixedIndexes = [new Array(fix).keys()];
    var visibleIndexes = visiblePageNumbers.reduce(function (acc, pageNumber) {
      var itemsCount = getItemsCountOnPage(pageNumber, itemsPerPage, totalCount);

      var pageIndexes = _toConsumableArray(new Array(itemsCount).keys()).map(function (index) {
        return pageNumber * itemsPerPage + index;
      });

      return [].concat(_toConsumableArray(acc), [pageIndexes]);
    }, shouldRenderFixed ? fixedIndexes : []);
    var result = visibleIndexes.reduce(function (acc, item) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(item));
    }, []);
    if (shouldRenderFixed) result.splice(fix, fix);
    return result;
  }, []);
  var visibleRows = useMemo(function () {
    return getVisibleIndexes({
      startIndex: rowsStartIndex,
      fix: fixRows,
      visiblePageNumbers: visibleRowsPageNumbers,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows
    });
  }, [rowsStartIndex, fixRows, visibleRowsPageNumbers, rowsPerPage, totalRows, getVisibleIndexes]);
  var visibleColumns = useMemo(function () {
    return totalColumns && getVisibleIndexes({
      startIndex: columnsStartIndex,
      fix: fixColumns,
      visiblePageNumbers: visibleColumnsPageNumbers,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns
    });
  }, [columnsStartIndex, fixColumns, visibleColumnsPageNumbers, columnsPerPage, totalColumns, getVisibleIndexes]);

  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      buffer = _useState8[0],
      setBuffer = _useState8[1];

  useEffect(function () {
    if (loadPage) {
      var loadPages =
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var _loop, i;

          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _loop = function _loop(i) {
                    var visiblePageNumber = visibleRowsPageNumbers[i];
                    setBuffer(function (buffer) {
                      if (buffer[visiblePageNumber]) return buffer;

                      var onLoad = function onLoad(loadResult) {
                        setBuffer(function (buffer) {
                          var nextBuffer = _toConsumableArray(buffer);

                          nextBuffer[visiblePageNumber] = loadResult;
                          return nextBuffer;
                        });
                      };

                      loadPage(visiblePageNumber, rowsPerPage).then(onLoad);
                      return buffer;
                    });
                  };

                  for (i = 0; i < visibleRowsPageNumbers.length; i++) {
                    _loop(i);
                  }

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function loadPages() {
          return _ref3.apply(this, arguments);
        };
      }();

      loadPages();
    }
  }, [visibleRowsPageNumbers, rowsPage, loadPage, rowsPerPage]);
  var loadedValues = useMemo(function () {
    return loadPage && buffer.reduce(function (acc, page, index) {
      var curPage = page || _toConsumableArray(new Array(getItemsCountOnPage(index, rowsPerPage, totalRows)).fill());

      return [].concat(_toConsumableArray(acc), _toConsumableArray(curPage));
    }, []);
  }, [loadPage, buffer, rowsPerPage, totalRows]);
  var adjustGapsWithFixed = useCallback(function (_ref4) {
    var gaps = _ref4.gaps,
        meta = _ref4.meta,
        startIndex = _ref4.startIndex,
        fixCount = _ref4.fixCount,
        defaultSize = _ref4.defaultSize;
    var displayFixed = startIndex > fixCount;
    var fixedSize = 0,
        hiddenSize = 0;

    if (displayFixed) {
      fixedSize = getItemsSize({
        meta: meta,
        count: fixCount,
        defaultSize: defaultSize
      });
      hiddenSize = getItemsSize({
        startIndex: startIndex,
        count: fixCount,
        meta: meta,
        defaultSize: defaultSize
      });
    }

    return _objectSpread({}, gaps, {
      start: gaps.start - fixedSize + hiddenSize,
      middle: gaps.middle - hiddenSize + fixedSize
    });
  }, []);
  var rowsGaps = useMemo(function () {
    var gaps = getGaps({
      scrollPages: rowsScrollPages,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: rowsPage
    });
    gaps = adjustGapsWithFixed({
      gaps: gaps,
      meta: rows,
      startIndex: rowsStartIndex,
      fixCount: fixRows,
      defaultSize: defaultRowHeight
    });
    return gaps;
  }, [fixRows, rows, rowsPage, rowsPerPage, defaultRowHeight, totalRows, rowsScrollPages, adjustGapsWithFixed, rowsStartIndex]);
  var lastRowsPageGaps = useMemo(function () {
    return lazy && getGaps({
      scrollPages: rowsScrollPages,
      defaultSize: defaultRowHeight,
      itemsPerPage: rowsPerPage,
      totalCount: totalRows,
      page: lastRowsPage
    });
  }, [rowsScrollPages, lazy, lastRowsPage, rowsPerPage, defaultRowHeight, totalRows]);
  var columnsGaps = useMemo(function () {
    if (!totalColumns) return;
    var gaps = getGaps({
      scrollPages: columnsScrollPages,
      defaultSize: defaultColumnWidth,
      itemsPerPage: columnsPerPage,
      totalCount: totalColumns,
      page: columnsPage
    });
    gaps = adjustGapsWithFixed({
      gaps: gaps,
      meta: columns,
      startIndex: columnsStartIndex,
      fixCount: fixColumns,
      defaultSize: defaultColumnWidth
    });
    return gaps;
  }, [columns, columnsPage, columnsPerPage, defaultColumnWidth, totalColumns, fixColumns, columnsScrollPages, adjustGapsWithFixed, columnsStartIndex]);
  var coverStyles = useMemo(function () {
    return {
      height: lazy ? lastRowsPageGaps.start + lastRowsPageGaps.middle : rowsGaps.start + rowsGaps.middle + rowsGaps.end,
      width: columnsGaps && columnsGaps.start + columnsGaps.middle + columnsGaps.end,
      position: 'relative'
    };
  }, [lazy, rowsGaps, columnsGaps, lastRowsPageGaps]);
  var pagesStyles = useMemo(function () {
    return {
      top: rowsGaps.start,
      left: columnsGaps && columnsGaps.start,
      position: 'absolute'
    };
  }, [rowsGaps, columnsGaps]);
  var gridStyles = useMemo(function () {
    return totalColumns && {
      display: 'inline-grid',
      gridTemplateColumns: "repeat(".concat(visibleColumns.length, ", auto)")
    };
  }, [totalColumns, visibleColumns]);
  var rowsOffsets = useMemo(function () {
    return fixRows ? getFixedOffsets({
      meta: rows,
      defaultSize: defaultRowHeight,
      fixed: fixRows
    }) : [];
  }, [fixRows, defaultRowHeight, rows]);
  var columnsOffsets = useMemo(function () {
    return fixColumns ? getFixedOffsets({
      meta: columns,
      defaultSize: defaultColumnWidth,
      fixed: fixColumns
    }) : [];
  }, [fixColumns, defaultColumnWidth, columns]);
  var nextRows = useMemo(function () {
    var rowsMeta = rows || [];

    var nextRows = _toConsumableArray(new Array(Math.max(rowsMeta.length, rowsOffsets.length)).keys());

    return nextRows.map(function (key, index) {
      return _objectSpread({}, rowsMeta[index], {
        offset: rowsOffsets[index]
      });
    });
  }, [rows, rowsOffsets]);
  var nextColumns = useMemo(function () {
    var columnsMeta = columns || [];

    var nextColumns = _toConsumableArray(new Array(Math.max(columnsMeta.length, columnsOffsets.length)).keys());

    return nextColumns.map(function (key, index) {
      return _objectSpread({}, columnsMeta[index], {
        offset: columnsOffsets[index]
      });
    });
  }, [columns, columnsOffsets]);
  return {
    rowsPage: rowsPage,
    columnsPage: columnsPage,
    rows: nextRows,
    columns: nextColumns,
    visibleRows: visibleRows,
    visibleColumns: visibleColumns,
    loadedValues: loadedValues,
    onScroll: handleScroll,
    coverStyles: coverStyles,
    pagesStyles: pagesStyles,
    gridStyles: gridStyles
  };
};

export default useScroller;