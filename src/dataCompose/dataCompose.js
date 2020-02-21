import get from 'lodash/get';

/**
 * @param {import('./').FilterItem} filterItem
 * @returns {boolean}
 */
const evaluateFilterResult = (value, filterItem) => {
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
  const fieldValue = get(value, path);

  const type = typeof filter;
  if (type === 'function') {
    return filter(fieldValue);
  }

  const [filterType, filterValue] = type === 'object' ? Object.entries(filter)[0] : ['', filter];

  switch(filterType) {
    case '$eq':
      return fieldValue === filterValue;
    case '$ne':
      return fieldValue !== filterValue;
    case '$gt':
      return fieldValue > filterValue;
    case '$gte':
      return fieldValue >= filterValue;
    case '$lt':
      return fieldValue < filterValue;
    case '$lte':
      return fieldValue <= filterValue;
    case '$in':
      return filterValue.some(item => item === fieldValue);
    case '$nin':
      return !filterValue.some(item => item === fieldValue);
    default:
      // Assuming it as default 'eq' filter
      return fieldValue === filterValue;
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