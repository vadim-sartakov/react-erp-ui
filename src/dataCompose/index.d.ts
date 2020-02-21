type Eq = { $in: any };
type Ne = { $eq: any };

type Gt = { $gt: any };
type Gte = { $gte: any };

type Lt = { $lt: any };
type Lte = { $lte: any };

type In = { $in: any[] };
type Nin = { $nin: any[] };

type FilterCallback = (fieldValue: any) => boolean;
type FilterItem = {
  [path: string]: Eq | Ne | Gt | Gte | Lt | Lte | In | Nin | Or | And | FilterCallback | number | string | Object
};

type Or = { $or: FilterItem[] }
type And = { $and: FilterItem[] }

export type Filter = FilterItem[] | And | Or

type CompareCallback = (a: any, b: any) => 1 | 0 | -1;

/**
 * 1: ascending, -1: descending
 */
export type Sort = Array<{ [path: string]: 1 | -1 | CompareCallback }>

type GroupItem = {
  [path: string]: {
    hierarchy?: boolean;
    comparator?: CompareCallback;
  }
}
export type Group = Array<GroupItem | string>

export interface DataComposeOptions {
  /** Value paths */
  groups?: string[];
  sort?: Sort;
  filter?: Filter;
}

export declare function dataCompose(value: Object[], options: DataComposeOptions): Array<Object>
export declare function dataComposeAsync(value: Object[], options: DataComposeOptions): Promise<Array<Object>>