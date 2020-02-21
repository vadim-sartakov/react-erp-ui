import get from 'lodash/get';

function comparePlainValues(a, b) {
  const aType = typeof a;
  const bType = typeof b;
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() < b.getTime() ? -1 : a.getTime() > b.getTime() ? 1 : 0;
  } else if (aType === 'string' && bType === 'string') {
    return a.localeCompare(b);
  } else if (aType === 'number' && bType === 'number') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
};

/**
 * 
 * @param {Object[]} value 
 * @param {import('./').Sort} sort 
 * @returns {Object[]}
 */
function sort(value, sort) {
  return value.sort((a, b) => {
    return sort.reduce((prev, sortItem) => {
      if (prev !== 0) return prev;
      const [path, comparator] = typeof sortItem === 'string' ? [sortItem, sortItem] : Object.entries(sortItem)[0];
      const aValue = get(a, path);
      const bValue = get(b, path);
      if (typeof comparator === 'function') return comparator(aValue, bValue);
      else if (comparator === 1) return comparePlainValues(aValue, bValue);
      else if (comparator === -1) return comparePlainValues(aValue, bValue) * -1;
      else return comparePlainValues(aValue, bValue);
    }, 0);
  });
};

export default sort;