export interface NormalizedRelativeTreeValue {
  parent: any;
}

export interface NormalizedLeveledTreeValue {
  level?: number
}

export interface TreeValue {
  children?: TreeValue[];
}

export type CompareCallback = (a: any, b: any) => boolean

export interface Options {
  /** Default is 'id' */
  idPath?: string;
  /** Default is 'parent' */
  parentPath?: string;
  /** How id and parent should be compared. If not provided then strict equal '===' will be used */
  comparator?: CompareCallback
}

export declare function relativeArrayToTree(array: NormalizedRelativeTreeValue[], options?: Options): Promise<TreeValue[]>
export declare function treeToLeveledArray(tree: TreeValue[]): Promise<NormalizedLeveledTreeValue[]>