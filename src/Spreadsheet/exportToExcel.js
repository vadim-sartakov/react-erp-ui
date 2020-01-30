import ExcelJS from 'exceljs';
import triggerDownload from '../utils/triggerDownload';

function pixelsToHeightPoints(pixels) {
  return pixels * 72 / 96;
}

function pixelsToWidthPoints(pixels) {
  const points = pixelsToHeightPoints(pixels);
  const charToPointRatio = 8.43 / 48;  
  return points * charToPointRatio;
}

const convertHeadings = (internalHeadings, sizeProp, type) => {
  if (!internalHeadings) return [];
  const resultHeadings = [];
  for (let i = 0; i < internalHeadings.length; i++) {
    const curHeading = internalHeadings[i];
    if (curHeading && curHeading.size) {
      const size = type === 'column' ? pixelsToWidthPoints(curHeading.size) : pixelsToHeightPoints(curHeading.size);
      resultHeadings[i] = {
        [sizeProp]: size,
        outlineLevel: curHeading.level,
        hidden: curHeading.hidden
      };
    }
  }
  return resultHeadings;
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
  totalRows,
  totalColumns,
  fixRows,
  fixColumns,
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
      defaultColWidth: pixelsToWidthPoints(defaultColumnWidth)
    }
  });
  sheet.rows = convertHeadings(rows, 'height');
  sheet.columns = convertHeadings(columns, 'width', 'column');

  for (let rowIndex = 0; rowIndex < value.length; rowIndex++) {
    await writeRow(sheet, value, rowIndex);
  }
  return workbook;
};

async function exportToExcel(spreadsheetData, fileName) {
  const workbook = await convertToWorkbook(spreadsheetData);
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);
};

export default exportToExcel;