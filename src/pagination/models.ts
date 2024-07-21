export interface PaginationAction {
  active: boolean;
  label: string;
  value: number;
}

export interface PaginationState<T> {
  collection: T[];
  count: number;
  index: number;
  maxPage: number;
}

export interface PaginationEvent {
  pageIsFirst: boolean;
  pageIsLast: boolean;
}
