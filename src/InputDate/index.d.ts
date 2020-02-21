import { Dispatch, SetStateAction, FunctionComponent, HTMLAttributes } from 'react';

export interface InputDateProps extends HTMLAttributes<{}> {
  defaultValue?: any;
  value?: any;
  onChange?: Dispatch<SetStateAction<any>>;
  /** Moment.js capable date-time format. Input will be masked according to this format string */
  format: string;
}

export type InputDateType = FunctionComponent<InputDateProps>

/**
 * Date time text input component. Provides masked input according to specified date format.
 * Operates with moment.js objects
 */
export declare const DatePickerInput: InputDateType