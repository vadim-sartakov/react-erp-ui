type Eq = { $in: any };
type Ne = { $eq: any };

type Gt = { $gt: any };
type Gte = { $gte: any };

type Lt = { $lt: any };
type Lte = { $lte: any };

type In = { $in: any[] };
type Nin = { $nin: any[] };

type FilterItem = {
  [path: string]: any | Eq | Ne | Gt | Gte | Lt | Lte | In | Nin | Or | And
};

type Or = { $or: FilterItem[] }
type And = { $and: FilterItem[] }

export type Filter = FilterItem[] | And | Or

/**
 * 1: ascending, -1: descending
 */
export type Sort = Array<{ [path: string]: 1 | -1 }>

export interface DataComposeOptions {
  /** Value paths */
  rowsGroups?: string[];
  /** Value paths */
  columnsGroups?: string[];
  sort?: Sort;
  filter?: Filter;
}

export declare function dataCompose(value: Object[] | Object[][], options: DataComposeOptions): Array<Object>
export declare function dataComposeAsync(value: Object[] | Object[][], options: DataComposeOptions): Promise<Array<Object>>