import {
  DateRange,
  assignDayInDate,
  dateIsBetween,
  getDateWeight,
  getDaysOfMonth
} from '@rolster/helpers-date';
import { DayRangeState, WeekRangeState } from './models';
import { DAYS_WEEK } from './constants';

export interface DayRangePickerProps {
  date: Date;
  range: DateRange;
  sourceDate: Date;
  minDate?: Date;
  maxDate?: Date;
}

function dateIsSelected(base: Date, date: Date, day: number): boolean {
  return (
    date.getFullYear() === base.getFullYear() &&
    date.getMonth() === base.getMonth() &&
    day === date.getDate()
  );
}

function sourceIsSelected(
  { sourceDate }: DayRangePickerProps,
  base: Date,
  day: number
): boolean {
  return dateIsSelected(base, sourceDate, day);
}

function rangeIsSelected(
  { range }: DayRangePickerProps,
  base: Date,
  day: number
): boolean {
  return (
    dateIsSelected(base, range.minDate, day) ||
    dateIsSelected(base, range.maxDate, day)
  );
}

function dayIsRange(
  { range }: DayRangePickerProps,
  base: Date,
  day: number
): boolean {
  return dateIsBetween(
    range.minDate,
    range.maxDate,
    assignDayInDate(base, day)
  );
}

function createDayRangeState(
  props: DayRangePickerProps,
  base: Date,
  day?: number
): DayRangeState {
  return {
    disabled: dayRangeIsOutside(props, day || 0),
    end: day ? rangeIsSelected(props, base, day) : false,
    forbidden: !day,
    ranged: day ? dayIsRange(props, base, day) : false,
    source: day ? sourceIsSelected(props, base, day) : false,
    value: day
  };
}

function createFirstWeek(
  props: DayRangePickerProps,
  base: Date
): WeekRangeState {
  const days: DayRangeState[] = [];

  let day = 1;

  for (let start = 0; start < base.getDay(); start++) {
    days.push(createDayRangeState(props, base));
  }

  for (let end = base.getDay(); end < 7; end++) {
    days.push(createDayRangeState(props, base, day));

    day++;
  }

  return { days };
}

function createDaysPending(
  props: DayRangePickerProps,
  base: Date,
  days: number
): DayRangeState[] {
  const daysPending: DayRangeState[] = [];
  const length = 7 - days;

  for (let index = 0; index < length; index++) {
    daysPending.push(createDayRangeState(props, base));
  }

  return daysPending;
}

function createNextWeeks(
  props: DayRangePickerProps,
  base: Date
): WeekRangeState[] {
  const weeks: WeekRangeState[] = [];
  const { date } = props;

  const dayCount = getDaysOfMonth(date.getFullYear(), date.getMonth());

  let days: DayRangeState[] = [];
  let countDays = 1;
  let day = DAYS_WEEK - base.getDay() + 1;

  do {
    days.push(createDayRangeState(props, date, day));

    day++;
    countDays++;

    if (countDays > 7) {
      weeks.push({ days });

      days = [];
      countDays = 1;
    }
  } while (day <= dayCount);

  if (days.length && days.length < DAYS_WEEK) {
    weeks.push({
      days: [...days, ...createDaysPending(props, base, days.length)]
    });
  }

  return weeks;
}

export function dayRangeIsOutsideMin(
  props: DayRangePickerProps,
  day: number
): boolean {
  const { date, minDate } = props;

  return minDate
    ? getDateWeight(assignDayInDate(date, day)) < getDateWeight(minDate)
    : false;
}

export function dayRangeIsOutsideMax(
  props: DayRangePickerProps,
  day: number
): boolean {
  const { date, maxDate } = props;

  return maxDate
    ? getDateWeight(assignDayInDate(date, day)) > getDateWeight(maxDate)
    : false;
}

export function dayRangeIsOutside(
  props: DayRangePickerProps,
  day: number
): boolean {
  return dayRangeIsOutsideMin(props, day) || dayRangeIsOutsideMax(props, day);
}

export function createDayRangePicker(props: DayRangePickerProps) {
  const date = new Date(props.date.getFullYear(), props.date.getMonth(), 1);

  const firstWeek = createFirstWeek(props, date);
  const nextWeeks = createNextWeeks(props, date);

  return [firstWeek, ...nextWeeks];
}
