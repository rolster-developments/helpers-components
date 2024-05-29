import { COUNT_YEAR_RANGE } from './constants';
import { YearPickerTemplate, YearState } from './models';

interface YearPickerProps {
  date: Date;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

function createYear(props: YearPickerProps, value?: number): YearState {
  return {
    value,
    disabled: !value,
    selected: value === props.date.getFullYear()
  };
}

export function yearIsOutlineMin(props: YearPickerProps): boolean {
  const { year, minDate } = props;

  return minDate ? year < minDate.getFullYear() : false;
}

export function yearIsOutlineMax(props: YearPickerProps): boolean {
  const { year, maxDate } = props;

  return maxDate ? year > maxDate.getFullYear() : false;
}

export function yearIsOutside(props: YearPickerProps): boolean {
  return yearIsOutlineMin(props) || yearIsOutlineMax(props);
}

export function checkYearPicker(props: YearPickerProps): Undefined<number> {
  const { maxDate, minDate } = props;

  return minDate && yearIsOutlineMin(props)
    ? minDate.getFullYear()
    : maxDate && yearIsOutlineMax(props)
      ? maxDate.getFullYear()
      : undefined;
}

export function createYearPicker(props: YearPickerProps): YearPickerTemplate {
  const { year, maxDate, minDate } = props;

  const prevYears: YearState[] = [];
  const nextYears: YearState[] = [];

  let minRange = year;
  let maxRange = year;

  const minYear = minDate?.getFullYear() || 0;
  const maxYear = maxDate?.getFullYear() || 0;

  for (let index = 0; index < COUNT_YEAR_RANGE; index++) {
    const prevValue = year - COUNT_YEAR_RANGE + index;
    const nextValue = year + index + 1;

    const prevYear = prevValue >= minYear ? prevValue : undefined;
    const nextYear = nextValue <= maxYear ? nextValue : undefined;

    const prevState = createYear(props, prevYear);
    const nextState = createYear(props, nextYear);

    prevYears.push(prevState);
    nextYears.push(nextState);

    if (!!prevState.value && minRange > prevState.value) {
      minRange = prevState.value;
    }

    if (!!nextState.value && maxRange < nextState.value) {
      maxRange = nextState.value;
    }
  }

  const yearCenter = createYear(props, year);

  return {
    canPrevious: minYear < minRange,
    canNext: maxYear > maxRange,
    maxRange,
    minRange,
    years: [...prevYears, yearCenter, ...nextYears]
  };
}
