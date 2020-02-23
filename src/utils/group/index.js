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

function getCurrentGroup(groups, path) {
  return groups.find(group => {
    const curPath = typeof group === 'string' ? group : Object.keys(group)[0];
    return curPath === path;
  });
}

function findChildrenElements(array, groups, groupValues) {
  return array.filter(item => {
    return Object.entries(groupValues).reduce((prev, [path, value]) => {
      if (!prev) return prev;
      const curValue = get(item, path);
      const curGroup = getCurrentGroup(groups, path);
      const groupParams = curGroup && typeof curGroup === 'object' && Object.entries(curGroup)[0][1];
      const comparator = groupParams && groupParams.comparator;
      return comparator ? comparator(curValue, value) : valuesAreEqual(curValue, value);
    }, true);
  });
};

export function fillGroupsTree(array, groupsTree, groups, groupValues = {}) {
  return groupsTree.map(({ children: groupTreeItemChildren, ...groupTreeItem }) => {
    const [path, groupValue] = Object.entries(groupTreeItem)[0];
    const nextGroupValues = { ...groupValues, [path]: groupValue };
    const children = groupTreeItemChildren ?
        fillGroupsTree(array, groupTreeItemChildren, groups, nextGroupValues) :
        findChildrenElements(array, groups, nextGroupValues);
    const result = { ...groupTreeItem };
    if (children) result.children = children;
    return result;
  });
};

function reduceGroup(tree, reducer, acc) {
  return tree.reduce((acc, treeItem) => {
    return treeItem.children ? reduceGroup(treeItem.children, reducer, acc) : reducer(acc, treeItem);
  }, acc);
};

export function reduceGroups(tree, groups) {
  return tree.map(({ children, ...groupTreeItem }) => {
    if (!children) return groupTreeItem;
    const path = Object.entries(groupTreeItem)[0][0];
    const curGroup = getCurrentGroup(groups, path);
    const groupParams = curGroup && typeof curGroup === 'object' && Object.entries(curGroup)[0][1]; 
    const reducer = groupParams.reducer;
    const initialValue = (groupParams.initialReducerValue && groupParams.initialReducerValue(groupTreeItem)) || groupTreeItem;
    const reducedGroup = reduceGroup(children, reducer, initialValue);
    const nextChildren = reduceGroups(children, groups);
    const result = { ...reducedGroup };
    if (nextChildren) result.children = nextChildren;
    return result;    
  });
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