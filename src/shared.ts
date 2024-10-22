import { hasPattern } from '@rolster/strings';

export interface FilterCriteria<T = any> {
  apply(value: T): boolean;
}

export class PatternCriteria implements FilterCriteria {
  constructor(private pattern: string) {}

  public apply(value: any): boolean {
    return hasPattern(JSON.stringify(value), this.pattern, true);
  }
}
