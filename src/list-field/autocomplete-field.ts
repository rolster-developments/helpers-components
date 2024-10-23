import { hasPattern } from '@rolster/strings';
import {
  AbstractAutocompleteElement as Element,
  AutocompleteStore,
  AutocompleteStoreNulleable
} from './models';

interface FilterOptions<T = unknown, E extends Element<T> = Element<T>> {
  pattern: Nulleable<string>;
  suggestions: E[];
  reboot?: boolean;
  store?: AutocompleteStore<T, E>;
}

interface FilterResponse<T, E extends Element<T> = Element<T>> {
  collection: E[];
  store: AutocompleteStore<T, E>;
}

function createEmptyStore<
  T = unknown,
  E extends Element<T> = Element<T>
>(): AutocompleteStore<T, E> {
  return {
    coincidences: undefined,
    pattern: '',
    previous: null
  };
}

function searchForPattern<T = unknown, E extends Element<T> = Element<T>>(
  options: FilterOptions<T, E>
): AutocompleteStoreNulleable<T, E> {
  const { pattern, store } = options;

  if (!store?.pattern) {
    return null;
  }

  let currentStore: AutocompleteStoreNulleable<T, E> = store;
  let search = false;

  while (!search && currentStore) {
    search = hasPattern(pattern || '', currentStore.pattern, true);

    if (!search) {
      currentStore = currentStore.previous;
    }
  }

  return currentStore || createEmptyStore();
}

export function createStoreAutocomplete<
  T = unknown,
  E extends Element<T> = Element<T>
>(options: FilterOptions<T, E>): FilterResponse<T, E> {
  const { pattern, suggestions, reboot } = options;

  if (!pattern) {
    return {
      collection: suggestions,
      store: createEmptyStore()
    };
  }

  const store = reboot ? createEmptyStore<T, E>() : searchForPattern(options);
  const elements = store?.coincidences || suggestions;

  const coincidences = elements.filter((element) =>
    element.coincidence(pattern)
  );

  return {
    collection: coincidences,
    store: {
      coincidences,
      pattern,
      previous: store
    }
  };
}
