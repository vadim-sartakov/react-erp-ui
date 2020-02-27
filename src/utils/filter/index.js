import get from 'lodash/get';

/**
 * @param {Object} value
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
  let fieldValue = get(value, path);

  const type = typeof filter;
  if (type === 'function') {
    return filter(fieldValue);
  }

  let [filterType, filterValue] = type === 'object' ? Object.entries(filter)[0] : ['', filter];
  
  if (fieldValue instanceof Date) fieldValue = fieldValue.getTime();
  if (filterValue instanceof Date) filterValue = filterValue.getTime();

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
      // Assuming it is a default 'eq' filter
      return fieldValue === filterValue;
  }

};

/**
 * 
 * @param {Object[]} value 
 * @param {import('./').Filter} filter 
 */
async function filter(value, filter) {
  return value.reduce(async (prev, rowValue) => {
    const acc = await prev;
    const shouldInclude = evaluateFilterResult(rowValue, filter);
    return shouldInclude ? [...acc, rowValue] : acc;
  }, Promise.resolve([]));
};

export default filter;