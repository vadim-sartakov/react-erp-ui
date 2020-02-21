import get from 'lodash/get';

/**
 * @param {import('./').FilterItem} filterItem
 * @returns {boolean}
 */
const evaluateFilterResult = (value, filterItem, comparators) => {
  if (filterItem.$and || Array.isArray(filterItem)) {
    return (filterItem.$and || filterItem).reduce((prev, filterItem) => {
      if (!prev) return prev;
      return evaluateFilterResult(value, filterItem);
    }, true);
  } else if (filterItem.$or) {
    return filterItem.$or.reduce((prev, filterItem) => {
      if (prev) return prev;
      return evaluateFilterResult(value, filterItem);
    }, false); 
  }

  const [path, filter] = Object.entries(filterItem)[0];

  const comparableValue = get(value, path);
  const comparator = comparators && comparators[path];

  if (comparator) return comparator(comparableValue, filter);

  if (filter.$eq) {
    return comparableValue === Object.entries(filter)[0][1];
    // Assuming it as default 'eq' filter
  } else {
    return comparableValue === filter;
  }
};

/**
 * 
 * @param {Object[] | Object[][]} value 
 * @param {import('./').DataComposeOptions} options 
 */
export const dataCompose = (value, options) => {
  let composeResult = value;

  if (options.filter) {
    composeResult = composeResult.filter(rowValue => {
      return evaluateFilterResult(rowValue, options.filter);
    });
  }

  return composeResult;
};
export const dataComposeAsync = async () => {};