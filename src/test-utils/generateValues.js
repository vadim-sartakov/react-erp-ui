export const generateMeta = count => {
  return [...new Array(count).keys()];
};

export const generateListValues = count => {
  return generateMeta(count).map(row => {
    return `Value ${row}`;
  });
};

export const generateGridValues = (rowsCount, columnsCount) => {
  return generateMeta(rowsCount).map(row => {
    return generateMeta(columnsCount).map(column => {
      return `Value ${row} - ${column}`;
    });
  });
};

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}