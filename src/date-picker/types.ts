import { DateRange } from '@rolster/helpers-date';

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
