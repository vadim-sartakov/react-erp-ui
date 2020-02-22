import get from 'lodash/get';

function valuesAreEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else {
    return a === b;
  }
}

export function extractGroupValues(value, groups) {
  return groups.reduce((acc, group) => {
    const [path, groupParams] = typeof group === 'string' ? [group, group] : Object.entries(group)[0];
    const values = value.reduce((acc, valueItem) => {
      const curValue = get(valueItem, path);
      const comparator = groupParams.comparator;
      const alreadyExists = acc.some(curItem => comparator ? comparator(curItem, curValue) : valuesAreEqual(curItem, curValue));
      return alreadyExists ? acc : [...acc, curValue];
    }, []);
    return [...acc, { [path]: values }];
  }, []);
}

/**
 * 
 * @param {Object[]} value 
 * @param {import('./').Group[]} groups 
 */
function group(value, groups) {
  let groupedResult = [];
  
  

  return groupedResult;
}

export default group;