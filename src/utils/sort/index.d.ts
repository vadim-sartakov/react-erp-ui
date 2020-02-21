type CompareCallback = (a: any, b: any) => 1 | 0 | -1;

/**
 * 1: ascending, -1: descending
 */
export type Sort = Array<string | { [path: string]: 1 | -1 | CompareCallback }>

/**
 * MongoDB - like utility for sorting arrays of objects
 */
declare function sort(value: Object[], sort: Sort): Object[]

export default sort