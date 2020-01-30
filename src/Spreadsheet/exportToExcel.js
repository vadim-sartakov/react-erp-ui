import ExcelJS from 'exceljs';
import triggerDownload from '../utils/triggerDownload';

function pixelsToHeightPoints(pixels) {
  return pixels * 72 / 96;
}

// Conversion factor http://www.vbaexpress.com/forum/showthread.php?28488-Solved-Set-column-width-in-pixels
const POINTS_PER_CHARACTER = 5.25;

function pixelsToWidthPoints(pixels) {
  const points = pixelsToHeightPoints(pixels);
  return points / POINTS_PER_CHARACTER;
}

function pixelsToPoints(type, pixels) {
  return type === 'column' ? pixelsToWidthPoints(pixels) : pixelsToHeightPoints(pixels);
}

function fillHeadings(sheet, { internalHeadings, totalCount, sizeProp, type, getter, defaultSize }) {
  if (!internalHeadings) return [];
  for (let i = 0; i < totalCount; i++) {
    const curHeading = internalHeadings[i];
    const heading = sheet[getter](i + 1);

    const sizeInPixels = (curHeading && curHeading.size) || defaultSize;
    heading[sizeProp] = pixelsToPoints(type, sizeInPixels);
    if (curHeading) {
      if (curHeading.level !== undefined) heading.outlineLevel = curHeading.level;
      if (curHeading.hidden !== undefined) heading.hidden = curHeading.hidden;
    }
  }
};

async function writeRow(sheet, value, rowIndex) {
  const rowValue = value[rowIndex];
  if (!rowValue) return;
  for (let columnIndex = 0; columnIndex < rowValue.length; columnIndex++) {
    const value = rowValue[columnIndex];
    const cell = sheet.getCell(rowIndex + 1, columnIndex + 1);
    cell.value = value;
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
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('My Sheet', {
    views: (fixColumns || fixRows) && [
      {
        state: 'frozen',
        xSplit: fixColumns,
        ySplit: fixRows
      }
    ],
    properties: {
      defaultRowHeight: pixelsToHeightPoints(defaultRowHeight),
      defaultColWidth: pixelsToWidthPoints(defaultColumnWidth),
      outlineProperties: {
        summaryBelow: false,
        summaryRight: false,
      }
    }
  });
  
  for (let rowIndex = 0; rowIndex < value.length; rowIndex++) {
    await writeRow(sheet, value, rowIndex);
  }
  fillHeadings(sheet, { type: 'row', internalHeadings: rows, totalCount: totalRows, sizeProp: 'height', getter: 'getRow', defaultSize: defaultRowHeight });
  fillHeadings(sheet, { type: 'column', internalHeadings: columns, totalCount: totalColumns, sizeProp: 'width', getter: 'getColumn', defaultSize: defaultColumnWidth });
  return workbook;
};

async function exportToExcel(spreadsheetData, fileName) {
  const workbook = await convertToWorkbook(spreadsheetData);
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);
};

export default exportToExcel;