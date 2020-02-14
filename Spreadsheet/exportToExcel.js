import _regeneratorRuntime from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/regenerator";
import _asyncToGenerator from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/asyncToGenerator";
import _defineProperty from "D:\\Node projects\\react-erp-ui\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { Workbook } from 'exceljs';
import triggerDownload from '../utils/triggerDownload';

function pixelsToPoints(pixels) {
  return pixels * 72 / 96;
} // Conversion factor http://www.vbaexpress.com/forum/showthread.php?28488-Solved-Set-column-width-in-pixels


var POINTS_PER_CHARACTER = 5.25;

function columnHeadingPixelsToPoints(pixels) {
  var points = pixelsToPoints(pixels);
  return points / POINTS_PER_CHARACTER;
}

function headingPixelsToPoints(type, pixels) {
  return type === 'column' ? columnHeadingPixelsToPoints(pixels) : pixelsToPoints(pixels);
}

function convertColor(color) {
  if (!color) return;
  return {
    argb: color.replace('#', '')
  };
}

function convertBorder(border) {
  if (!border) return;
  return {
    style: border.style,
    color: convertColor(border.color)
  };
}
/**
 * 
 * @param {import('exceljs').Row | import('exceljs').Column | import('exceljs').Cell} object 
 * @param {import('./').Style} style 
 */


function convertStyles(object, style) {
  if (!style) return;
  var alignment = {};
  if (style.horizontalAlign) alignment.horizontal = style.horizontalAlign;
  if (style.verticalAlign) alignment.vertical = style.verticalAlign;
  if (style.wrapText) alignment.wrapText = style.wrapText;
  if (Object.keys(alignment).length) object.alignment = alignment;

  if (style.font) {
    var font = _objectSpread({}, object.font);

    if (style.font.name) font.name = style.font.name;
    if (style.font.size) font.size = pixelsToPoints(style.font.size);
    if (style.font.bold) font.bold = style.font.bold;
    if (style.font.italic) font.italic = style.font.italic;
    if (style.font.color) font.color = convertColor(style.font.color);
    if (Object.keys(font).length) object.font = font;
  }

  if (style.fill) {
    object.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: convertColor(style.fill)
    };
  }

  if (style.border) {
    object.border = {};
    if (style.border.top) object.border.top = convertBorder(style.border.top);
    if (style.border.left) object.border.left = convertBorder(style.border.left);
    if (style.border.bottom) object.border.bottom = convertBorder(style.border.bottom);
    if (style.border.right) object.border.right = convertBorder(style.border.right);
  }
}

function fillHeadings(sheet, _ref) {
  var _ref$internalHeadings = _ref.internalHeadings,
      internalHeadings = _ref$internalHeadings === void 0 ? [] : _ref$internalHeadings,
      totalCount = _ref.totalCount,
      sizeProp = _ref.sizeProp,
      type = _ref.type,
      getter = _ref.getter,
      defaultSize = _ref.defaultSize;

  for (var i = 0; i < totalCount; i++) {
    var curHeading = internalHeadings[i];
    var heading = sheet[getter](i + 1);
    heading.font = {
      name: 'Arial',
      size: pixelsToPoints(14)
    };
    var sizeInPixels = curHeading && curHeading.size || defaultSize;
    heading[sizeProp] = headingPixelsToPoints(type, sizeInPixels);

    if (curHeading) {
      if (curHeading.level !== undefined) heading.outlineLevel = curHeading.level;
      if (curHeading.hidden !== undefined) heading.hidden = curHeading.hidden;
      convertStyles(heading, curHeading.style);
    }
  }
}

;

function writeRow(_x, _x2, _x3, _x4) {
  return _writeRow.apply(this, arguments);
}

function _writeRow() {
  _writeRow = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(sheet, cells, rowIndex, totalColumns) {
    var rowCells, columnIndex, curCell, cell;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            rowCells = cells[rowIndex];

            if (rowCells) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            columnIndex = 0;

          case 4:
            if (!(columnIndex < totalColumns)) {
              _context.next = 14;
              break;
            }

            curCell = rowCells[columnIndex];

            if (curCell) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("continue", 11);

          case 8:
            cell = sheet.getCell(rowIndex + 1, columnIndex + 1);
            convertStyles(cell, curCell.style);
            cell.value = curCell.value;

          case 11:
            columnIndex++;
            _context.next = 4;
            break;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _writeRow.apply(this, arguments);
}

export function convertToWorkbook(_x5) {
  return _convertToWorkbook.apply(this, arguments);
}

function _convertToWorkbook() {
  _convertToWorkbook = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(_ref2) {
    var cells, mergedCells, rows, columns, fixRows, fixColumns, totalRows, totalColumns, defaultRowHeight, defaultColumnWidth, workbook, sheet, rowIndex;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cells = _ref2.cells, mergedCells = _ref2.mergedCells, rows = _ref2.rows, columns = _ref2.columns, fixRows = _ref2.fixRows, fixColumns = _ref2.fixColumns, totalRows = _ref2.totalRows, totalColumns = _ref2.totalColumns, defaultRowHeight = _ref2.defaultRowHeight, defaultColumnWidth = _ref2.defaultColumnWidth;
            workbook = new Workbook();
            sheet = workbook.addWorksheet('My Sheet', {
              views: (fixColumns || fixRows) && [{
                state: 'frozen',
                xSplit: fixColumns,
                ySplit: fixRows
              }],
              properties: {
                defaultRowHeight: pixelsToPoints(defaultRowHeight),
                defaultColWidth: columnHeadingPixelsToPoints(defaultColumnWidth),
                outlineProperties: {
                  summaryBelow: false,
                  summaryRight: false
                }
              }
            });
            fillHeadings(sheet, {
              type: 'row',
              internalHeadings: rows,
              totalCount: totalRows,
              sizeProp: 'height',
              getter: 'getRow',
              defaultSize: defaultRowHeight
            });
            fillHeadings(sheet, {
              type: 'column',
              internalHeadings: columns,
              totalCount: totalColumns,
              sizeProp: 'width',
              getter: 'getColumn',
              defaultSize: defaultColumnWidth
            });
            rowIndex = 0;

          case 6:
            if (!(rowIndex < totalRows)) {
              _context2.next = 12;
              break;
            }

            _context2.next = 9;
            return writeRow(sheet, cells, rowIndex, totalColumns);

          case 9:
            rowIndex++;
            _context2.next = 6;
            break;

          case 12:
            mergedCells && mergedCells.forEach(function (mergedRange) {
              sheet.mergeCells(mergedRange.start.row + 1, mergedRange.start.column + 1, mergedRange.end.row + 1, mergedRange.end.column + 1);
            });
            return _context2.abrupt("return", workbook);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _convertToWorkbook.apply(this, arguments);
}

;

function exportToExcel(_x6, _x7) {
  return _exportToExcel.apply(this, arguments);
}

function _exportToExcel() {
  _exportToExcel = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3(spreadsheetData, fileName) {
    var workbook, buffer;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return convertToWorkbook(spreadsheetData);

          case 2:
            workbook = _context3.sent;
            _context3.next = 5;
            return workbook.xlsx.writeBuffer();

          case 5:
            buffer = _context3.sent;
            triggerDownload(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _exportToExcel.apply(this, arguments);
}

;
export default exportToExcel;