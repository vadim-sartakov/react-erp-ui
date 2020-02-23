export interface NormalizedTreeValue {
  parent: any;
}

export interface TreeValue {
  children?: TreeValue[];
}

export type Group = string | {
  [path: string]: {
    /** Group key compare callback */
    comparator?: CompareCallback;
    /** Describes how to accumulate data into current group */
    reducer: (value: Object) => Object;
    initialReducerValue?: any;
  }
}

type GroupValues = { [path: string]: Array<any> }

export function extractGroupValues(array: Object[], groups: Group[]): GroupValues
export function buildGroupsTree(groupValues: GroupValues): TreeValue[]
export function fillGroupsTree(array: Object[], groupsTree: TreeValue[], groups: Group[]): TreeValue[]

/**
 * Array grouping utility.
 * Initial tree value could be supplied. In that case
 * final result will be built inside provided value.
 */
declare function group(array: Object[], groups: Group[]): TreeValue[]

export default group