import { itIsDefined } from '@rolster/helpers-advanced';
import { MONTH_NAMES, Month } from '@rolster/helpers-date';
import { MonthLimitTemplate, MonthState } from './models';

interface MonthPickerProps {
  date: Date;
  month: number;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

interface MonthLimitProps {
  month?: Nulleable<number>;
  date?: Date;
  maxDate?: Date;
  minDate?: Date;
}

function createMonthState(props: MonthPickerProps, value: number): MonthState {
  const { date, month, year } = props;

  return {
    value,
    label: MONTH_NAMES()[value],
    disabled: monthIsOutside(props, value),
    selected: date.getFullYear() === year && value === month
  };
}

export function monthIsOutsideMin(
  props: MonthPickerProps,
  month: number
): boolean {
  const { year, minDate } = props;

  return minDate
    ? minDate.getFullYear() === year && month < minDate.getMonth()
    : false;
}

export function monthIsOutsideMax(
  props: MonthPickerProps,
  month: number
): boolean {
  const { year, maxDate } = props;

  return maxDate
    ? maxDate.getFullYear() === year && month > maxDate.getMonth()
    : false;
}

export function monthIsOutside(
  props: MonthPickerProps,
  month: number
): boolean {
  return monthIsOutsideMin(props, month) || monthIsOutsideMax(props, month);
}

export function checkMonthPicker(props: MonthPickerProps): Undefined<number> {
  const { maxDate, minDate, month } = props;

  return minDate && monthIsOutsideMin(props, month)
    ? minDate.getMonth()
    : maxDate && monthIsOutsideMax(props, month)
      ? maxDate.getMonth()
      : undefined;
}

export function createMonthPicker(props: MonthPickerProps): MonthState[] {
  return [
    createMonthState(props, Month.January),
    createMonthState(props, Month.February),
    createMonthState(props, Month.March),
    createMonthState(props, Month.April),
    createMonthState(props, Month.May),
    createMonthState(props, Month.June),
    createMonthState(props, Month.July),
    createMonthState(props, Month.August),
    createMonthState(props, Month.September),
    createMonthState(props, Month.October),
    createMonthState(props, Month.November),
    createMonthState(props, Month.December)
  ];
}

type MinMonthLimitProps = Omit<MonthLimitProps, 'maxDate'>;
type MaxMonthLimitProps = Omit<MonthLimitProps, 'minDate'>;

export function monthIsLimitMin(props: MinMonthLimitProps): boolean {
  const { month, date, minDate } = props;

  if (itIsDefined(month) && date) {
    const minYear = minDate ? minDate.getFullYear() : 0;
    const minMonth = minDate ? minDate.getMonth() : 0;

    return date.getFullYear() === minYear && month <= minMonth;
  }

  return false;
}

export function monthIsLimitMax(props: MaxMonthLimitProps): boolean {
  const { month, date, maxDate } = props;

  if (itIsDefined(month) && date) {
    const maxYear = maxDate ? maxDate.getFullYear() : 10000;
    const maxMonth = maxDate ? maxDate.getMonth() : 11;

    return date.getFullYear() === maxYear && month >= maxMonth;
  }

  return false;
}

export function monthIsLimit(props: MaxMonthLimitProps): boolean {
  return monthIsLimitMin(props) || monthIsLimitMax(props);
}

export function monthLimitTemplate(props: MonthLimitProps): MonthLimitTemplate {
  return {
    limitNext: monthIsLimitMax(props),
    limitPrevious: monthIsLimitMin(props)
  };
}
