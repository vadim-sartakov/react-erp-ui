import get from 'lodash/get';

function valuesAreEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else {
    return a === b;
  }
};

async function getChildren(array, item, options) {
  const curId = get(item, options.idPath || 'id');
  let children = await array.reduce(async (prev, curItem) => {
    const acc = await prev;
    const curParent = get(curItem, options.parentPath || 'parent');
    const comparator = options.comparator;
    const shouldInclude = comparator ? comparator(curId, curParent) : valuesAreEqual(curId, curParent);
    return shouldInclude ? [...acc, curItem] : acc;
  }, Promise.resolve([]));
  children = await children.reduce(async (prev, child) => {
    const acc = await prev;
    const result = { ...child };
    const nestedChildren = await getChildren(array, child, options);
    if (nestedChildren.length) result.children = nestedChildren;
    return [...acc, result];
  }, Promise.resolve([]));
  return children;
};

export async function buildTree(array, options = {}) {
  const rootElements = await array.reduce(async (prev, item) => {
    const acc = await prev;
    const parent = get(item, options.parentPath || 'parent');
    return parent === undefined || parent === null ? [...acc, item] : acc;
  }, Promise.resolve([]));
  return rootElements.reduce(async (prev, item) => {
    const acc = await prev;
    const children = await getChildren(array, item, options);
    const result = { ...item };
    if (children.length) result.children = children;
    return [...acc, result];
  }, Promise.resolve([]));
};

export async function extractGroupValues(array, groups) {
  return groups.reduce(async (prev, group) => {
    const acc = await prev;
    const [path, groupParams] = typeof group === 'string' ? [group, group] : Object.entries(group)[0];
    if (groupParams && groupParams.tree) return [...acc, { [path]: groupParams.tree }];
    const values = array.reduce((acc, valueItem) => {
      const curValue = get(valueItem, path);
      const comparator = groupParams.comparator;
      const alreadyExists = acc.some(curItem => comparator ? comparator(curItem, curValue) : valuesAreEqual(curItem, curValue));
      return alreadyExists ? acc : [...acc, curValue];
    }, []);
    return [...acc, { [path]: values }];
  }, Promise.resolve([]));
};

export async function buildGroupsTree(groupValues, level = 0, curValues = undefined) {
  const [path, groupValuesArray] = Object.entries(groupValues[level])[0];
  const values = curValues || groupValuesArray;
  return values.reduce(async (prev, value) => {
    const acc = await prev;
    // Working with tree node
    let result, children;
    if (value.children) {
      const nextValue = { ...value };
      delete nextValue.children;
      result = { [path]: nextValue };
      children = await buildGroupsTree(groupValues, level, value.children);
    } else {
      result = { [path]: value };
      children = level < groupValues.length - 1 && await buildGroupsTree(groupValues, level + 1);
    }
    if (children) result.children = children;
    return [...acc, result];
  }, Promise.resolve([]));
};

function getCurrentGroup(groups, path) {
  return groups.find(group => {
    const curPath = typeof group === 'string' ? group : Object.keys(group)[0];
    return curPath === path;
  });
};

async function findChildrenElements(array, groups, groupValues) {
  return array.reduce(async (prev, item) => {
    const acc = await prev;
    const shouldInclude = Object.entries(groupValues).reduce((prev, [path, value]) => {
      if (!prev) return prev;
      const curValue = get(item, path);
      const curGroup = getCurrentGroup(groups, path);
      const groupParams = curGroup && typeof curGroup === 'object' && Object.entries(curGroup)[0][1];
      const comparator = groupParams && groupParams.comparator;
      return comparator ? comparator(curValue, value) : valuesAreEqual(curValue, value);
    }, true);
    return shouldInclude ? [...acc, item] : acc;
  }, Promise.resolve([]));
};

export async function fillGroupsTree(array, groupsTree, groups, groupValues = {}) {
  return groupsTree.reduce(async (prev, { children: groupTreeItemChildren, ...groupTreeItem }) => {
    const acc = await prev;
    const [path, groupValue] = Object.entries(groupTreeItem)[0];
    const nextGroupValues = { ...groupValues, [path]: groupValue };
    const children = groupTreeItemChildren ?
        await fillGroupsTree(array, groupTreeItemChildren, groups, nextGroupValues) :
        await findChildrenElements(array, groups, nextGroupValues);
    const result = { ...groupTreeItem };
    if (children) result.children = children;
    return [...acc, result];
  }, Promise.resolve([]));
};

async function reduceGroup(tree, reducer, acc) {
  return tree.reduce(async (prev, treeItem) => {
    const acc = await prev;
    return treeItem.children ? reduceGroup(treeItem.children, reducer, acc) : reducer(acc, treeItem);
  }, Promise.resolve(acc));
};

export async function reduceGroups(tree, groups) {
  return tree.reduce(async (prev, { children, ...groupTreeItem }) => {
    const acc = await prev;
    if (!children) return [...acc, groupTreeItem];
    const path = Object.entries(groupTreeItem)[0][0];
    const curGroup = getCurrentGroup(groups, path);
    const groupParams = curGroup && typeof curGroup === 'object' && Object.entries(curGroup)[0][1]; 
    const reducer = groupParams.reducer;
    const initialValue = (groupParams.initialReducerValue && groupParams.initialReducerValue(groupTreeItem)) || groupTreeItem;
    const reducedGroup = await reduceGroup(children, reducer, initialValue);
    const nextChildren = await reduceGroups(children, groups);
    const result = { ...reducedGroup };
    if (nextChildren) result.children = nextChildren;
    return [...acc, result];    
  }, Promise.resolve([]));
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