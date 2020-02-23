import get from 'lodash/get';

function valuesAreEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else {
    return a === b;
  }
};

export function extractGroupValues(array, groups) {
  return groups.reduce((acc, group) => {
    const [path, groupParams] = typeof group === 'string' ? [group, group] : Object.entries(group)[0];
    const values = array.reduce((acc, valueItem) => {
      const curValue = get(valueItem, path);
      const comparator = groupParams.comparator;
      const alreadyExists = acc.some(curItem => comparator ? comparator(curItem, curValue) : valuesAreEqual(curItem, curValue));
      return alreadyExists ? acc : [...acc, curValue];
    }, []);
    return [...acc, { [path]: values }];
  }, []);
};

export function buildGroupsTree(groupValues) {
  if (!groupValues || groupValues.length === 0) return;
  const [path, values] = Object.entries(groupValues[0])[0];
  return values.map(value => {
    const children = buildGroupsTree(groupValues.slice(1));
    const result = { [path]: value };
    if (children) result.children = children;
    return result;
  }, []);
};

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