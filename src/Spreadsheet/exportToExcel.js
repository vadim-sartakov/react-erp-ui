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
    }

  }
};

async function writeRow(sheet, value, rowIndex, totalColumns) {
  const rowValue = value[rowIndex];
  if (!rowValue) return;
  for (let columnIndex = 0; columnIndex <totalColumns; columnIndex++) {
    const value = rowValue[columnIndex];
    if (!value) continue;
    const cell = sheet.getCell(rowIndex + 1, columnIndex + 1);
    cell.value = value.value;
  }
}

export async function convertToWorkbook({
  value,
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
    await writeRow(sheet, value, rowIndex, totalColumns);
  }

  mergedCells && mergedCells.forEach(mergedRange => {
    sheet.mergeCells(mergedRange.start.row + 1, mergedRange.start.column + 1, mergedRange.end.row + 1, mergedRange.end.column + 1)
  });

  console.log(sheet);

  return workbook;
};

async function exportToExcel(spreadsheetData, fileName) {
  const workbook = await convertToWorkbook(spreadsheetData);
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);
};

export default exportToExcel;