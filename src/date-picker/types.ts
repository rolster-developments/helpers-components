import { DateRange } from '@rolster/dates';

export enum PickerListenerType {
  Select = 'PickerSelect',
  Now = 'PickerNow',
  Cancel = 'PickerCancel'
}

type PickerValue = DateRange | Date | number;

export interface PickerListener<D extends PickerValue> {
  type: PickerListenerType;
  value?: D;
}
