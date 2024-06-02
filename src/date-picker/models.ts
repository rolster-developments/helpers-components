export interface DayState {
  disabled: boolean;
  focused: boolean;
  forbidden: boolean;
  selected: boolean;
  today: boolean;
  value?: number;
}

export interface WeekState {
  days: DayState[];
}

export interface DayRangeState {
  disabled: boolean;
  end: boolean;
  forbidden: boolean;
  source: boolean;
  ranged: boolean;
  value?: number;
}

export interface WeekRangeState {
  days: DayRangeState[];
}

export interface MonthState {
  value: number;
  label: string;
  disabled: boolean;
  focused: boolean;
  selected: boolean;
}

export interface MonthLimitTemplate {
  limitNext: boolean;
  limitPrevious: boolean;
}

export interface YearState {
  value?: number;
  disabled: boolean;
  focused: boolean;
  selected: boolean;
}

export interface YearPickerTemplate {
  canNext: boolean;
  canPrevious: boolean;
  maxRange: number;
  minRange: number;
  years: YearState[];
}
