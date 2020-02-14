import { Dispatch, SetStateAction, FunctionComponent, HTMLAttributes } from 'react';
import { Moment } from 'moment';

export interface DatePickerInputProps extends HTMLAttributes<{}> {
  defaultValue?: Moment;
  value?: Moment;
  onChange?: Dispatch<SetStateAction<Moment>>;
  /** Moment.js capable date-time format. Input will be masked according to this format string */
  format: string;
}

export type DatePickerInputType = FunctionComponent<DatePickerInputProps>
export declare const DatePickerInput: DatePickerInputType