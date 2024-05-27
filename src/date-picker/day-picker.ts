import {
  DateJson,
  dateToJson,
  getDateWeight,
  getDaysOfMonth
} from '@rolster/helpers-date';

const DAYS_WEEK = 7;

interface DayPickerProps {
  month: number;
  value: number;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

export interface DayState {
  disabled: boolean;
  forbidden: boolean;
  selected: boolean;
  value?: number;
}

export interface WeekState {
  days: DayState[];
}

function createDayState(props: DayPickerProps, value?: number): DayState {
  return {
    disabled: dayIsOutside(props, value || 0),
    forbidden: !value,
    selected: value === props.value,
    value
  };
}

function createDaysPending(props: DayPickerProps, days: number): DayState[] {
  const daysPending: DayState[] = [];
  const length = 7 - days;

  for (let index = 0; index < length; index++) {
    daysPending.push(createDayState(props));
  }

  return daysPending;
}

function createFirstWeek(props: DayPickerProps, date: Date): WeekState {
  const days: DayState[] = [];

  let day = 1;

  for (let start = 0; start < date.getDay(); start++) {
    days.push(createDayState(props));
  }

  for (let end = date.getDay(); end < 7; end++) {
    days.push(createDayState(props, day));

    day++;
  }

  return { days };
}

function createNextWeeks(props: DayPickerProps, date: Date): WeekState[] {
  const daysMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
  const weeks: WeekState[] = [];

  let days: DayState[] = [];
  let countDays = 1;
  let day = DAYS_WEEK - date.getDay() + 1;

  do {
    days.push(createDayState(props, day));

    day++;
    countDays++;

    if (countDays > DAYS_WEEK) {
      weeks.push({ days });

      days = [];
      countDays = 1;
    }
  } while (day <= daysMonth);

  if (days.length < DAYS_WEEK) {
    weeks.push({ days: [...days, ...createDaysPending(props, days.length)] });
  }

  return weeks;
}

export function dayIsOutsideMin(props: DayPickerProps, day: number): boolean {
  const { month, year, minDate } = props;

  return minDate
    ? getDateWeight(new Date(year, month, day)) < getDateWeight(minDate)
    : false;
}

export function dayIsOutsideMax(props: DayPickerProps, day: number): boolean {
  const { month, year, maxDate } = props;

  return maxDate
    ? getDateWeight(new Date(year, month, day)) > getDateWeight(maxDate)
    : false;
}

export function dayIsOutside(props: DayPickerProps, day: number): boolean {
  return dayIsOutsideMin(props, day) || dayIsOutsideMax(props, day);
}

export function createDayOutside(
  props: DayPickerProps,
  day: number
): Undefined<DateJson> {
  const { maxDate, minDate } = props;

  return minDate && dayIsOutsideMin(props, day)
    ? dateToJson(minDate)
    : maxDate && dayIsOutsideMax(props, day)
      ? dateToJson(maxDate)
      : undefined;
}

export function createDayPicker(props: DayPickerProps) {
  const date = new Date(props.year, props.month, 1);

  const firstWeek = createFirstWeek(props, date);
  const nextWeeks = createNextWeeks(props, date);

  return [firstWeek, ...nextWeeks];
}
