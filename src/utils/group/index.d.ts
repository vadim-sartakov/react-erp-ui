interface TreeValue {
  children?: TreeValue[]
}

type GroupItem = {
  [path: string]: {
    /** Group key compare callback */
    comparator?: CompareCallback;
    /** Describes how to accumulate data into current group */
    reduce: (value: Object[]) => Object;
  }
}
export type Group = Array<GroupItem | string>

/**
 * Array grouping utility.
 * Initial tree value could be supplied. In that case
 * final result will be built inside provided value.
 */
declare function group(value: TreeValue[], group: Group): TreeValue[]

export default group