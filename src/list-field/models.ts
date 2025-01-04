import { coincidence } from '@rolster/strings';
import { FilterCriteria } from '../commons';

export interface AbstractListElement<T = any> {
  description: string;
  value: T;
  compareTo(value: T): boolean;
  filtrable(criteria: FilterCriteria<T>): boolean;
}

export interface AbstractAutocompleteElement<T = any>
  extends AbstractListElement<T> {
  coincidence(pattern: string): boolean;
}

export interface ListElement<T = any> extends AbstractListElement<T> {
  title: string;
  code?: string;
  icon?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export interface AutocompleteElement<T = any>
  extends AbstractAutocompleteElement<T> {
  title: string;
  code?: string;
  icon?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export interface AutocompleteStore<
  T,
  E extends AbstractAutocompleteElement<T> = AbstractAutocompleteElement<T>
> {
  pattern: string;
  previous: Nulleable<AutocompleteStore<T, E>>;
  coincidences?: E[];
}

export type AutocompleteStoreNulleable<
  T,
  E extends AbstractAutocompleteElement<T> = AbstractAutocompleteElement<T>
> = AutocompleteStore<T, E> | null;

export class RolsterListElement<T = any> implements ListElement<T> {
  constructor(public readonly value: T) {}

  public get description(): string {
    return String(this.value);
  }

  public get title(): string {
    return String(this.value);
  }

  public compareTo(value: T): boolean {
    return value === this.value;
  }

  public filtrable(criteria: FilterCriteria<T>): boolean {
    return criteria.apply(this.value);
  }
}

export class RolsterAutocompleteElement<T = any>
  extends RolsterListElement<T>
  implements AutocompleteElement<T>
{
  public coincidence(pattern: string): boolean {
    return coincidence(JSON.stringify(this.value), pattern, true);
  }
}

export class ListCollection<T = any> {
  constructor(public readonly value: AbstractListElement<T>[]) {}

  public find(element: T): Undefined<AbstractListElement<T>> {
    return this.value.find((current) => current.compareTo(element));
  }
}
