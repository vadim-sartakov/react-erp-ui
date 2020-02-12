import _slicedToArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/slicedToArray";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
import _toConsumableArray from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef ScrollPage
 * @property {number} start
 * @property {number} end
 */
export var getVisiblePages = function getVisiblePages(page) {
  return page === 0 ? [0, 1] : [page - 1, page];
};
export var getTotalPages = function getTotalPages(totalCount, itemsPerPage) {
  return Math.ceil(totalCount / itemsPerPage);
};
/**
 * @function
 * @param {number} page 
 * @param {number} itemsPerPage 
 * @param {number} totalCount
 * @returns {number}
 */

export var getItemsCountOnPage = function getItemsCountOnPage(page, itemsPerPage, totalCount) {
  if (page === undefined) return 0;
  var totalPages = getTotalPages(totalCount, itemsPerPage);
  if (page >= totalPages) return 0;
  return page < totalPages - 1 ? itemsPerPage : totalCount - page * itemsPerPage;
};
/**
 * Creates scroll page object structure.
 * It helps to find current page depending on scroll position
 * @function
 * @param {Object} options
 * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
 * @param {number} options.defaultSize 
 * @param {number} options.itemsPerPage 
 * @returns {ScrollPage[]} [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
 */

export var getScrollPages = function getScrollPages(_ref) {
  var meta = _ref.meta,
      totalCount = _ref.totalCount,
      defaultSize = _ref.defaultSize,
      itemsPerPage = _ref.itemsPerPage;

  var values = _toConsumableArray(new Array(totalCount).keys());

  var result = values.reduce(function (_ref2, arrayItem, index, values) {
    var curPage = _ref2.curPage,
        pages = _ref2.pages;
    var curMeta = meta && meta[index];
    var selfSize = curMeta && curMeta.size || defaultSize;
    var isNextPage = index > 0 && index % itemsPerPage === 0;
    var nextPages = isNextPage ? [].concat(_toConsumableArray(pages), [curPage]) : pages;

    var nextCurPage = _objectSpread({}, curPage, {
      end: curPage.end + selfSize
    });

    if (isNextPage) {
      nextCurPage.start = curPage.end;
      delete nextCurPage.children;
    }

    if (index === values.length - 1) nextPages = [].concat(_toConsumableArray(nextPages), [nextCurPage]);
    return {
      curPage: nextCurPage,
      pages: nextPages
    };
  }, {
    curPage: {
      start: 0,
      end: 0
    },
    pages: []
  });
  return result.pages;
};
/**
 * @function
 * @param {ScrollPage[]} scrollPages [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
 * @param {number} [scroll=0]
 * @returns {number}
 */

export var getPageNumberFromScrollPages = function getPageNumberFromScrollPages(scrollPages) {
  var scroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (scroll < 0) return 0;
  var lastPageIndex = scrollPages.length - 1;
  if (scroll > scrollPages[lastPageIndex].end) return lastPageIndex;
  var currentPage = scrollPages.reduce(function (acc, page, index) {
    if (acc.pageIndex !== -1) return acc;
    var pageSize = page.end - page.start;
    var pageHalf = pageSize / 2;
    var curScroll = acc.curScroll + pageSize;
    var isInRange = scroll >= page.start && scroll < page.end;
    if (!isInRange) return _objectSpread({}, acc, {
      curScroll: curScroll
    });
    var pageIndex = scroll > page.start + pageHalf ? index + 1 : index;
    return {
      curScroll: curScroll,
      pageIndex: pageIndex
    };
  }, {
    curScroll: 0,
    pageIndex: -1
  });
  return currentPage.pageIndex;
};
/**
 * @function
 * @param {Object} options
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.scroll
 * @returns {number} 
 */

export var getPageNumberWithDefaultSize = function getPageNumberWithDefaultSize(_ref3) {
  var defaultSize = _ref3.defaultSize,
      itemsPerPage = _ref3.itemsPerPage,
      totalCount = _ref3.totalCount,
      scroll = _ref3.scroll;
  if (scroll < 0) return 0;
  var totalPages = getTotalPages(totalCount, itemsPerPage);
  var pageSize = defaultSize * itemsPerPage;
  var page = Math.floor((scroll + pageSize / 2) / pageSize);
  return Math.min(totalPages - 1, page);
};
/**
 * Generic page number calculation function which decides how page number
 * will be calculated depending on whether meta option is specified or not
 * @function
 * @param {Object} options
 * @param {ScrollPage} options.scrollPages
 * @param {Meta[]} options.meta
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.scroll
 */

export var getPageNumber = function getPageNumber(_ref4) {
  var scrollPages = _ref4.scrollPages,
      defaultSize = _ref4.defaultSize,
      itemsPerPage = _ref4.itemsPerPage,
      totalCount = _ref4.totalCount,
      scroll = _ref4.scroll;
  var curPage;

  if (scrollPages && scrollPages.length) {
    curPage = getPageNumberFromScrollPages(scrollPages, scroll);
  } else {
    curPage = getPageNumberWithDefaultSize({
      defaultSize: defaultSize,
      itemsPerPage: itemsPerPage,
      totalCount: totalCount,
      scroll: scroll
    });
  }

  return curPage;
};
/**
 * @typedef {Object} Gaps
 * @property {number} start 
 * @property {number} middle 
 * @property {number} end 
 */

/**
 * @function
 * @param {Object} options
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */

export var getGapsWithDefaultSize = function getGapsWithDefaultSize(_ref5) {
  var defaultSize = _ref5.defaultSize,
      itemsPerPage = _ref5.itemsPerPage,
      totalCount = _ref5.totalCount,
      page = _ref5.page;
  var pageSize = defaultSize * itemsPerPage;
  var visiblePages = getVisiblePages(page);
  var startSectionSize = visiblePages[0] * pageSize;
  var totalSize = totalCount * defaultSize;
  var visibleItems = getItemsCountOnPage(visiblePages[0], itemsPerPage, totalCount) + getItemsCountOnPage(visiblePages[1], itemsPerPage, totalCount);
  var visibleSectionSize = visibleItems * defaultSize;
  var endSectionSize = totalSize - (startSectionSize + visibleSectionSize);
  var middleSectionSize = totalSize - startSectionSize - endSectionSize;
  return {
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  };
};

var gapsReducer = function gapsReducer(acc, scrollPage) {
  return acc + (scrollPage.end - scrollPage.start);
};
/**
 * @function
 * @param {Object} options
 * @param {ScrollPage[]} options.scrollPages [ScrollPage]{@link module:components/Scroller/utils~ScrollPage}
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */


export var getGapsFromScrollPages = function getGapsFromScrollPages(_ref6) {
  var scrollPages = _ref6.scrollPages,
      page = _ref6.page;

  var _getVisiblePages = getVisiblePages(page),
      _getVisiblePages2 = _slicedToArray(_getVisiblePages, 2),
      startPage = _getVisiblePages2[0],
      endPage = _getVisiblePages2[1];

  var startSectionSize = scrollPages.slice(0, startPage).reduce(gapsReducer, 0);
  var middleSectionSize = scrollPages.slice(startPage, endPage + 1).reduce(gapsReducer, 0);
  var endSectionSize = scrollPages.slice(endPage + 1, scrollPages.length).reduce(gapsReducer, 0);
  return {
    start: startSectionSize,
    middle: middleSectionSize,
    end: endSectionSize
  };
};
/**
 * Generic function which calculates gaps depending on whether meta is specified or not.
 * @function
 * @param {Object} options
 * @param {ScrollPage} options.scrollPages
 * @param {number} options.defaultSize
 * @param {number} options.itemsPerPage
 * @param {number} options.totalCount
 * @param {number} options.page
 * @returns {Gaps} [Gaps]{@link module:components/Scroller/utils~Gaps}
 */

export var getGaps = function getGaps(_ref7) {
  var scrollPages = _ref7.scrollPages,
      defaultSize = _ref7.defaultSize,
      itemsPerPage = _ref7.itemsPerPage,
      totalCount = _ref7.totalCount,
      page = _ref7.page;
  var gaps;

  if (scrollPages && scrollPages.length) {
    gaps = getGapsFromScrollPages({
      scrollPages: scrollPages,
      page: page
    });
  } else {
    gaps = getGapsWithDefaultSize({
      defaultSize: defaultSize,
      itemsPerPage: itemsPerPage,
      totalCount: totalCount,
      page: page
    });
  }

  return gaps;
};
/**
 * @function
 * @param {Object} options
 * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
 * @param {number} options.defaultSize
 * @param {number} options.fixed - Number of fixed items
 * @returns {number[]}
 */

export var getFixedOffsets = function getFixedOffsets(_ref8) {
  var meta = _ref8.meta,
      defaultSize = _ref8.defaultSize,
      fixed = _ref8.fixed;

  var resultOffset = _toConsumableArray(new Array(fixed).keys()).reduce(function (acc, curKey, index) {
    var curOffset = index === 0 ? 0 : _toConsumableArray(new Array(index).keys()).reduce(function (acc, key, index) {
      var curMeta = meta && meta[index];
      var offset = curMeta ? curMeta.size || defaultSize : defaultSize;
      return acc + offset;
    }, 0);
    return [].concat(_toConsumableArray(acc), [curOffset]);
  }, []);

  return resultOffset;
};
/**
 * @function
 * @param {Object} options
 * @param {Meta[]} options.meta [Meta]{@link module:components/Scroller~Meta}
 * @param {number} options.defaultSize
 * @returns {number}
 */

export var getItemsSize = function getItemsSize(_ref9) {
  var _ref9$startIndex = _ref9.startIndex,
      startIndex = _ref9$startIndex === void 0 ? 0 : _ref9$startIndex,
      meta = _ref9.meta,
      count = _ref9.count,
      defaultSize = _ref9.defaultSize;
  if (!count) return 0;
  return meta ? _toConsumableArray(new Array(count).keys()).reduce(function (acc, key, index) {
    var curMeta = meta[index + startIndex];
    var curSize = curMeta && curMeta.size || defaultSize;
    return acc + curSize;
  }, 0) : count * defaultSize;
};
/**
 * Gets items from the source values
 * @function
 * @param {Object[]} value 
 * @param {number} page 
 * @param {number} itemsPerPage
 * @returns {Object[]}
 */

export var loadPage = function loadPage(value, page, itemsPerPage) {
  return value.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
};