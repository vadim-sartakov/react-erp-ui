import { Dispatch, SetStateAction, FunctionComponent, HTMLAttributes } from 'react';

export interface DatePickerInputProps extends HTMLAttributes<{}> {
  value?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  format: string
}

export type DatePickerInputType = FunctionComponent<DatePickerInputProps>
export declare const DatePickerInput: DatePickerInputType