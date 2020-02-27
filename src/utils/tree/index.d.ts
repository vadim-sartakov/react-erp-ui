export interface NormalizedTreeValue {
  parent: any;
}

export interface TreeValue {
  children?: TreeValue[];
}

export type CompareCallback = (a: any, b: any) => boolean

export interface BuildTreeOptions {
  /** Default is 'id' */
  idPath?: string;
  /** Default is 'parent' */
  parentPath?: string;
  /** How id and parent should be compared. If not provided then strict equal '===' will be used */
  comparator?: CompareCallback
}

/** Builds a tree of normalized array values */
export declare function buildTree(array: NormalizedTreeValue[], options?: BuildTreeOptions): Promise<TreeValue[]>