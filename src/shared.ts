export interface FilterCriteria<T = any> {
  apply(value: T): boolean;
}
