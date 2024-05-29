export interface AbstractListElement<T = unknown> {
  description: string;
  value: T;
  compareTo(value: T): boolean;
}

export interface AbstractAutocompleteElement<T = unknown>
  extends AbstractListElement<T> {
  hasCoincidence(pattern: string): boolean;
}

export interface ListElement<T = unknown> extends AbstractListElement<T> {
  title: string;
  code?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export interface AutocompleteElement<T = unknown>
  extends AbstractAutocompleteElement<T> {
  title: string;
  code?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export interface StoreAutocomplete<
  T,
  E extends AbstractAutocompleteElement<T> = AbstractAutocompleteElement<T>
> {
  pattern: string;
  previous: Nulleable<StoreAutocomplete<T, E>>;
  coincidences?: E[];
}

export type StoreAutocompleteNull<
  T,
  E extends AbstractAutocompleteElement<T> = AbstractAutocompleteElement<T>
> = StoreAutocomplete<T, E> | null;

export class ListCollection<T = unknown> {
  constructor(public readonly value: AbstractListElement<T>[]) {}

  public find(element: T): Undefined<AbstractListElement<T>> {
    return this.value.find((current) => current.compareTo(element));
  }
}
