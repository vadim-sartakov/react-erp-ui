type Eq = { $in: any };
type Ne = { $eq: any };

type Gt = { $gt: any };
type Gte = { $gte: any };

type Lt = { $lt: any };
type Lte = { $lte: any };

type In = { $in: any[] };
type Nin = { $nin: any[] };

type PathFilter = {
  [path: string]: any | Eq | Ne | Gt | Gte | Lt | Lte | In | Nin
};

type Or = { $or: PathFilter[] }
type And = { $and: PathFilter[] }

export type Filter = PathFilter[] | And | Or