import {
  dateIsEqualsWeight,
  getDateWeight,
  getDaysOfMonth
} from '@rolster/helpers-date';
import { DAYS_WEEK } from './constants';
import { DayState, WeekState } from './models';

interface DayPickerProps {
  date: Date;
  day: number;
  month: number;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

function createDayState(
  props: DayPickerProps,
  today: Date,
  value?: number
): DayState {
  const { date, day, month, year } = props;

  const dateValue = value && new Date(year, month, value);

  return {
    disabled: dayIsOutside(props, value || 0),
    focused: !!value && day === value,
    forbidden: !value,
    selected: !!dateValue && dateIsEqualsWeight(date, dateValue),
    today: !!dateValue && dateIsEqualsWeight(today, dateValue),
    value
  };
}

function createFirstWeek(
  props: DayPickerProps,
  date: Date,
  today: Date
): WeekState {
  const days: DayState[] = [];

  let day = 1;

  for (let start = 0; start < date.getDay(); start++) {
    days.push(createDayState(props, today));
  }

  for (let end = date.getDay(); end < 7; end++) {
    days.push(createDayState(props, today, day));

    day++;
  }

  return { days };
}

function createDaysPending(
  props: DayPickerProps,
  today: Date,
  days: number
): DayState[] {
  const daysPending: DayState[] = [];
  const length = 7 - days;

  for (let index = 0; index < length; index++) {
    daysPending.push(createDayState(props, today));
  }

  return daysPending;
}

function createNextWeeks(
  props: DayPickerProps,
  date: Date,
  today: Date
): WeekState[] {
  const daysMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
  const weeks: WeekState[] = [];

  let days: DayState[] = [];
  let countDays = 1;
  let day = DAYS_WEEK - date.getDay() + 1;

  do {
    days.push(createDayState(props, today, day));

    day++;
    countDays++;

    if (countDays > DAYS_WEEK) {
      weeks.push({ days });

      days = [];
      countDays = 1;
    }
  } while (day <= daysMonth);

  if (days.length && days.length < DAYS_WEEK) {
    weeks.push({
      days: [...days, ...createDaysPending(props, today, days.length)]
    });
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

export function checkDayPicker(props: DayPickerProps): Undefined<number> {
  const { day, maxDate, minDate } = props;

  return minDate && dayIsOutsideMin(props, day)
    ? minDate.getDate()
    : maxDate && dayIsOutsideMax(props, day)
      ? maxDate.getDate()
      : undefined;
}

export function createDayPicker(props: DayPickerProps) {
  const date = new Date(props.year, props.month, 1);
  const today = new Date();

  const firstWeek = createFirstWeek(props, date, today);
  const nextWeeks = createNextWeeks(props, date, today);

  return [firstWeek, ...nextWeeks];
}
