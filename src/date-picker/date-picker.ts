import { dateIsAfter, dateIsBefore } from '@rolster/helpers-date';

interface DateRangeProps {
  date: Date;
  maxDate?: Date;
  minDate?: Date;
}

export function dateOutRange(props: DateRangeProps): boolean {
  const { date, maxDate, minDate } = props;

  return (
    (!!minDate && dateIsBefore(minDate, date)) ||
    (!!maxDate && dateIsAfter(maxDate, date))
  );
}
