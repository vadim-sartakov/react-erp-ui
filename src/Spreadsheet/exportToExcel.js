import { Workbook } from 'exceljs';
import triggerDownload from '../utils/triggerDownload';

function pixelsToPoints(pixels) {
  return pixels * 72 / 96;
}

// Conversion factor http://www.vbaexpress.com/forum/showthread.php?28488-Solved-Set-column-width-in-pixels
const POINTS_PER_CHARACTER = 5.25;

function columnHeadingPixelsToPoints(pixels) {
  const points = pixelsToPoints(pixels);
  return points / POINTS_PER_CHARACTER;
}

function headingPixelsToPoints(type, pixels) {
  return type === 'column' ? columnHeadingPixelsToPoints(pixels) : pixelsToPoints(pixels);
}

/**
 * 
 * @param {import('exceljs').Row | import('exceljs').Column | import('exceljs').Cell} object 
 * @param {import('./').Style} style 
 */
function convertStyles(object, style) {
  if (!style) return;

  const alignment = {};
  if (style.horizontalAlign) alignment.horizontal = style.horizontalAlign;
  if (style.verticalAlign) alignment.vertical = style.verticalAlign;
  if (style.wrapText) alignment.wrapText = style.wrapText;

  if (Object.keys(alignment).length) object.alignment = alignment;

  if (style.fill) {
    object.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: style.fill.replace('#', '')
      }
    };
  }

}

function fillHeadings(sheet, { internalHeadings = [], totalCount, sizeProp, type, getter, defaultSize }) {
  for (let i = 0; i < totalCount; i++) {
    const curHeading = internalHeadings[i];
    const heading = sheet[getter](i + 1);

    heading.font = { name: 'Arial', size: pixelsToPoints(14) };

    const sizeInPixels = (curHeading && curHeading.size) || defaultSize;
    heading[sizeProp] = headingPixelsToPoints(type, sizeInPixels);
    if (curHeading) {
      if (curHeading.level !== undefined) heading.outlineLevel = curHeading.level;
      if (curHeading.hidden !== undefined) heading.hidden = curHeading.hidden;
      convertStyles(heading, curHeading.style);
    }

  }
};

async function writeRow(sheet, cells, rowIndex, totalColumns) {
  const rowCells = cells[rowIndex];
  if (!rowCells) return;
  for (let columnIndex = 0; columnIndex <totalColumns; columnIndex++) {
    const curCell = rowCells[columnIndex];
    if (!curCell) continue;
    const cell = sheet.getCell(rowIndex + 1, columnIndex + 1);
    convertStyles(cell, curCell.style);
    cell.value = curCell.value;
  }
}

export async function convertToWorkbook({
  cells,
  mergedCells,
  rows,
  columns,
  fixRows,
  fixColumns,
  totalRows,
  totalColumns,
  defaultRowHeight,
  defaultColumnWidth
}) {
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet('My Sheet', {
    views: (fixColumns || fixRows) && [
      {
        state: 'frozen',
        xSplit: fixColumns,
        ySplit: fixRows
      }
    ],
    properties: {
      defaultRowHeight: pixelsToPoints(defaultRowHeight),
      defaultColWidth: columnHeadingPixelsToPoints(defaultColumnWidth),
      outlineProperties: {
        summaryBelow: false,
        summaryRight: false
      }
    }
  });
  
  fillHeadings(sheet, { type: 'row', internalHeadings: rows, totalCount: totalRows, sizeProp: 'height', getter: 'getRow', defaultSize: defaultRowHeight });
  fillHeadings(sheet, { type: 'column', internalHeadings: columns, totalCount: totalColumns, sizeProp: 'width', getter: 'getColumn', defaultSize: defaultColumnWidth });

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    await writeRow(sheet, cells, rowIndex, totalColumns);
  }

  mergedCells && mergedCells.forEach(mergedRange => {
    sheet.mergeCells(mergedRange.start.row + 1, mergedRange.start.column + 1, mergedRange.end.row + 1, mergedRange.end.column + 1)
  });

  return workbook;
};

async function exportToExcel(spreadsheetData, fileName) {
  const workbook = await convertToWorkbook(spreadsheetData);
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);
};

export default exportToExcel;