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

/**
 * Filter array utility which provides interface similar to MongoDB
 */
declare function filter(value: Object[], filter: Filter): Array<Object>

export default filter;