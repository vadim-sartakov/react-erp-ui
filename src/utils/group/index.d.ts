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

export type GroupValues = { [path: string]: Array<any> }

/** Extracts unique values for each group */
export declare function extractGroupValues(array: Object[], groups: Group[]): Promise<GroupValues>
export declare function buildGroupsTree(groupValues: GroupValues): Promise<TreeValue[]>
/** Fills groups tree with values from the array */
export declare function fillGroupsTree(array: Object[], groupsTree: TreeValue[], groups: Group[]): Promise<TreeValue[]>
export declare function reduceGroups(tree: TreeValue[], groups: Group[]): Promise<TreeValue[]>

declare function group(array: Object[], groups: Group[]): Promise<TreeValue[]>

export default group