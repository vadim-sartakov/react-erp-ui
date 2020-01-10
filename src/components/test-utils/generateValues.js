export const generateMeta = count => {
  return [...new Array(count).keys()];
};

export const generateListValues = count => {
  return generateMeta(count).map(row => {
    return { row };
  });
};

export const generateGridValues = (rowsCount, columnsCount) => {
  return generateMeta(rowsCount).map(row => {
    return generateMeta(columnsCount).map(column => {
      return { row, column };
    });
  });
};