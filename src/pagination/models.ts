export interface Page<T> {
  collection: T[];
  index: number;
}

export interface PageState {
  active: boolean;
  label: string;
  value: number;
  next?: PageState;
  previous?: PageState;
}

export interface PaginationTemplate {
  currentPage: PageState;
  description: string;
  firstPage: boolean;
  lastPage: boolean;
  pages: PageState[];
}
