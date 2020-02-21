export interface TreeValue {
  children?: TreeValue[]
}

export type Group = {
  [path: string]: {
    /** Group key compare callback */
    comparator?: CompareCallback;
    /** Describes how to accumulate data into current group */
    reduce: (value: TreeValue, allValues: TreeValue[]) => Object;
  }
}

/**
 * Array grouping utility.
 * Initial tree value could be supplied. In that case
 * final result will be built inside provided value.
 */
declare function group(value: TreeValue[], groups: Group[]): TreeValue[]

export default group