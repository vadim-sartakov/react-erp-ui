type GroupItem = {
  [path: string]: {
    hierarchy?: boolean;
    comparator?: CompareCallback;
  }
}
export type Group = Array<GroupItem | string>

declare function group(value: Object[], Group): Object[]