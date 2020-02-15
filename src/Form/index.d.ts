import { FunctionComponent, Dispatch, SetStateAction } from "react";

/**
 * Field errors object.
 * Keys are field paths, values are error messages or undefined if there is no error
 */
export type FieldErrors = { [field:string]: string }

export interface FormProps {
  value?: Object;
  onChange?: (fieldName: string, value: any) => void;
  fieldErrors: FieldErrors;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
}

export declare const Form: FunctionComponent<FormProps>

export interface UseFormOptions {
  defaultValue?: Object;
  /** Result form value */
  value?: Object;
  onChange?: Dispatch<SetStateAction<Object>>;
  /**
   * Validate callback which is triggered before submit.
   * Should be memorized.
   * Could be async.
   */
  validate?: (value: Object) => FieldErrors | Promise<FieldErrors>;
  /**
   * Submit callback which will be called if all validations succeeded.
   * If errors are returned then submit would not be proceeded.
   * Should be memorized.
   * Could be async.
   */
  handleSubmit?: (value: Object) => FieldErrors | Promise<FieldErrors>;
}

export interface UseFormResult {
  submitting: boolean;
  /** Callback which should be passed to submit trigger (Button or html form's onSubmit) */
  onSubmit: Function;
  formProps: FormProps;
}

export type useFormType = (options: UseFormOptions) => UseFormResult
export declare function useForm(options: UseFormOptions): UseFormResult

/** Field validate function. If there is error it should return error message, undefined otherwise */
export type ValidateFieldCallback = (value: any, allValues: Object, fieldName: string) => string | undefined;

export interface FieldProps {
  name: string;
  Component: FunctionComponent;
  /**
   * Arraut of validate functions.
   * Should be memorized.
   */
  validators: Array<ValidateFieldCallback>;
}

export declare const Field: FunctionComponent<FieldProps>