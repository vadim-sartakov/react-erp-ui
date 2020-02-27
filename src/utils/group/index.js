import get from 'lodash/get';

function valuesAreEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else {
    return a === b;
  }
};

function getChildren(array, item, options) {
  const curId = get(item, options.idPath || 'id');
  let children = array.filter(curItem => {
    const curParent = get(curItem, options.parentPath || 'parent');
    const comparator = options.comparator;
    return comparator ? comparator(curId, curParent) : valuesAreEqual(curId, curParent);
  });
  children = children.map(child => {
    const result = { ...child };
    const nestedChildren = getChildren(array, child, options);
    if (nestedChildren.length) result.children = nestedChildren;
    return result;
  });
  return children;
};

export function buildTree(array, options = {}) {
  const rootElements = array.filter(item => {
    const parent = get(item, options.parentPath || 'parent');
    return parent === undefined || parent === null;
  });
  return rootElements.reduce((acc, item) => {
    const children = getChildren(array, item, options);
    const result = { ...item };
    if (children.length) result.children = children;
    return [...acc, result];
  }, []);
};

export function extractGroupValues(array, groups) {
  return groups.reduce((acc, group) => {
    const [path, groupParams] = typeof group === 'string' ? [group, group] : Object.entries(group)[0];
    if (groupParams && groupParams.tree) return [...acc, { [path]: groupParams.tree }];
    const values = array.reduce((acc, valueItem) => {
      const curValue = get(valueItem, path);
      const comparator = groupParams.comparator;
      const alreadyExists = acc.some(curItem => comparator ? comparator(curItem, curValue) : valuesAreEqual(curItem, curValue));
      return alreadyExists ? acc : [...acc, curValue];
    }, []);
    return [...acc, { [path]: values }];
  }, []);
};

export function buildGroupsTree(groupValues, level = 0, curValues = undefined) {
  const [path, groupValuesArray] = Object.entries(groupValues[level])[0];
  const values = curValues || groupValuesArray;
  return values.map(value => {
    // Working with tree node
    let result, children;
    if (value.children) {
      const nextValue = { ...value };
      delete nextValue.children;
      result = { [path]: nextValue };
      children = buildGroupsTree(groupValues, level, value.children);
    } else {
      result = { [path]: value };
      children = level < groupValues.length - 1 && buildGroupsTree(groupValues, level + 1);
    }
    if (children) result.children = children;
    return result;
  });
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