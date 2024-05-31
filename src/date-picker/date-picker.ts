import {
  dateIsAfter,
  dateIsBefore,
  normalizeMaxTime,
  normalizeMinTime
} from '@rolster/helpers-date';

interface DateRangeProps {
  date: Date;
  maxDate?: Date;
  minDate?: Date;
}

export function dateIsOutRangeMin(props: DateRangeProps): boolean {
  const { date, minDate } = props;

  return !!minDate && dateIsBefore(normalizeMinTime(minDate), date);
}

export function dateIsOutRangeMax(props: DateRangeProps): boolean {
  const { date, maxDate } = props;

  return !!maxDate && dateIsAfter(normalizeMaxTime(maxDate), date);
}

export function dateOutRange(props: DateRangeProps): boolean {
  return dateIsOutRangeMin(props) || dateIsOutRangeMax(props);
}

export function checkDateRange(props: DateRangeProps): Date {
  const { date, maxDate, minDate } = props;

  return minDate && dateIsOutRangeMax(props)
    ? minDate
    : maxDate && dateIsOutRangeMax(props)
      ? maxDate
      : date;
}
