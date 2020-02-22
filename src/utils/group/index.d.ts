export interface TreeValue {
  children?: TreeValue[]
}

export type Group = string | {
  [path: string]: {
    /** Group key compare callback */
    comparator?: CompareCallback;
    /** Describes how to accumulate data into current group */
    reduce: (value: Object, allValues: Object[]) => Object;
  }
}

export function extractGroupValues(value: Object[], groups: Group[]): { [path: string]: Array<any> }

/**
 * Array grouping utility.
 * Initial tree value could be supplied. In that case
 * final result will be built inside provided value.
 */
declare function group(value: Object[], groups: Group[]): TreeValue[]

export default group