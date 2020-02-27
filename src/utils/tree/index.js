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