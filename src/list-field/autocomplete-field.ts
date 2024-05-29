import { hasPattern } from '@rolster/helpers-string';
import {
  AbstractAutocompleteElement as Element,
  StoreAutocomplete,
  StoreAutocompleteNull
} from './models';

interface FilterProps<T = unknown, E extends Element<T> = Element<T>> {
  pattern: Nulleable<string>;
  suggestions: E[];
  reboot?: boolean;
  store?: StoreAutocomplete<T, E>;
}

interface FilterResponse<T, E extends Element<T> = Element<T>> {
  collection: E[];
  store: StoreAutocomplete<T, E>;
}

function createEmptyStore<
  T = unknown,
  E extends Element<T> = Element<T>
>(): StoreAutocomplete<T, E> {
  return {
    coincidences: undefined,
    pattern: '',
    previous: null
  };
}

function searchForPattern<T = unknown, E extends Element<T> = Element<T>>(
  props: FilterProps<T, E>
): StoreAutocompleteNull<T, E> {
  const { pattern, store } = props;

  if (!store?.pattern) {
    return null;
  }

  let newStore: StoreAutocompleteNull<T, E> = store;
  let search = false;

  while (!search && newStore) {
    search = hasPattern(pattern || '', newStore.pattern, true);

    if (!search) {
      newStore = newStore.previous;
    }
  }

  return newStore || createEmptyStore();
}

export function createStoreAutocomplete<
  T = unknown,
  E extends Element<T> = Element<T>
>(props: FilterProps<T, E>): FilterResponse<T, E> {
  const { pattern, suggestions, reboot } = props;

  if (!pattern) {
    return { collection: suggestions, store: createEmptyStore() };
  }

  const store = reboot ? createEmptyStore<T, E>() : searchForPattern(props);
  const elements = store?.coincidences || suggestions;

  const coincidences = elements.filter((element) =>
    element.hasCoincidence(pattern)
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
