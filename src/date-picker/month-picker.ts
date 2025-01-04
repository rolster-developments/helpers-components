import { itIsDefined } from '@rolster/commons';
import { MONTH_NAMES, Month } from '@rolster/dates';
import { MonthLimitTemplate, MonthState } from './models';

export interface MonthPickerOptions {
  date: Date;
  month: number;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

export interface MonthLimitProps {
  month?: Nulleable<number>;
  date?: Date;
  maxDate?: Date;
  minDate?: Date;
}

function createMonthState(
  options: MonthPickerOptions,
  value: number
): MonthState {
  return {
    disabled: monthIsOutside(options, value),
    focused: value === options.month,
    label: MONTH_NAMES()[value],
    selected:
      options.date.getFullYear() === options.year &&
      value === options.date.getMonth(),
    value
  };
}

export function monthIsOutsideMin(
  options: MonthPickerOptions,
  month: number
): boolean {
  return options.minDate
    ? options.minDate.getFullYear() === options.year &&
        month < options.minDate.getMonth()
    : false;
}

export function monthIsOutsideMax(
  options: MonthPickerOptions,
  month: number
): boolean {
  return options.maxDate
    ? options.maxDate.getFullYear() === options.year &&
        month > options.maxDate.getMonth()
    : false;
}

export function monthIsOutside(
  options: MonthPickerOptions,
  month: number
): boolean {
  return monthIsOutsideMin(options, month) || monthIsOutsideMax(options, month);
}

export function verifyMonthPicker(
  options: MonthPickerOptions
): Undefined<number> {
  return options.minDate && monthIsOutsideMin(options, options.month)
    ? options.minDate.getMonth()
    : options.maxDate && monthIsOutsideMax(options, options.month)
      ? options.maxDate.getMonth()
      : undefined;
}

export function createMonthPicker(options: MonthPickerOptions): MonthState[] {
  return [
    createMonthState(options, Month.January),
    createMonthState(options, Month.February),
    createMonthState(options, Month.March),
    createMonthState(options, Month.April),
    createMonthState(options, Month.May),
    createMonthState(options, Month.June),
    createMonthState(options, Month.July),
    createMonthState(options, Month.August),
    createMonthState(options, Month.September),
    createMonthState(options, Month.October),
    createMonthState(options, Month.November),
    createMonthState(options, Month.December)
  ];
}

type MinMonthLimitProps = Omit<MonthLimitProps, 'maxDate'>;
type MaxMonthLimitProps = Omit<MonthLimitProps, 'minDate'>;

export function monthIsLimitMin(options: MinMonthLimitProps): boolean {
  if (itIsDefined(options.month) && options.date) {
    const minYear = options.minDate ? options.minDate.getFullYear() : 0;
    const minMonth = options.minDate ? options.minDate.getMonth() : 0;

    return options.date.getFullYear() === minYear && options.month <= minMonth;
  }

  return false;
}

export function monthIsLimitMax(options: MaxMonthLimitProps): boolean {
  if (itIsDefined(options.month) && options.date) {
    const maxYear = options.maxDate ? options.maxDate.getFullYear() : 10000;
    const maxMonth = options.maxDate ? options.maxDate.getMonth() : 11;

    return options.date.getFullYear() === maxYear && options.month >= maxMonth;
  }

  return false;
}

export function monthIsLimit(options: MaxMonthLimitProps): boolean {
  return monthIsLimitMin(options) || monthIsLimitMax(options);
}

export function monthLimitTemplate(
  options: MonthLimitProps
): MonthLimitTemplate {
  return {
    limitNext: monthIsLimitMax(options),
    limitPrevious: monthIsLimitMin(options)
  };
}
