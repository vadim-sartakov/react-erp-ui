import { Dispatch, SetStateAction, FunctionComponent, HTMLAttributes } from 'react';
import { Moment } from 'moment';

export interface InputDateProps extends HTMLAttributes<{}> {
  defaultValue?: Moment;
  value?: Moment;
  onChange?: Dispatch<SetStateAction<Moment>>;
  /** Moment.js capable date-time format. Input will be masked according to this format string */
  format: string;
}

export type InputDateType = FunctionComponent<InputDateProps>

/**
 * Date time text input component. Provides masked input according to specified date format.
 */
export declare const DatePickerInput: InputDateType