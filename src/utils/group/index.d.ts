export interface NormalizedTreeValue {
  parent: any;
}

export interface TreeValue {
  children?: TreeValue[];
}

export type CompareCallback = (a: any, b: any) => boolean

export type Group = string | {
  [path: string]: {
    /** Group key compare callback */
    comparator?: CompareCallback;
    /** Describes how to accumulate data into current group */
    reducer: (value: Object) => Object;
    initialReducerValue?: any;
    /** If current group supposed to be as hierarchical tree */
    tree?: TreeValue[];
  }
}

type GroupValues = { [path: string]: Array<any> }

interface BuildTreeOptions {
  /** Default is 'id' */
  idPath?: string;
  /** Default is 'parent' */
  parentPath?: string;
  /** How id and parent should be compared. If not provided then strict '===' will be used */
  comparator?: CompareCallback
}
/** Builds a tree of normalized array values */
export function buildTree(array: NormalizedTreeValue[], options?: BuildTreeOptions): TreeValue[]
/** Extracts unique values for each group */
export function extractGroupValues(array: Object[], groups: Group[]): GroupValues
export function buildGroupsTree(groupValues: GroupValues): TreeValue[]
/** Fills groups tree with values from the array */
export function fillGroupsTree(array: Object[], groupsTree: TreeValue[], groups: Group[]): TreeValue[]
export function reduceGroups(tree: TreeValue[], groups: Group[])

/**
 * Array grouping utility.
 * Initial tree value could be supplied. In that case
 * final result will be built inside provided value.
 */
declare function group(array: Object[], groups: Group[]): TreeValue[]

export default group