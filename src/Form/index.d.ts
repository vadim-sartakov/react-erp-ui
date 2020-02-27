import { FunctionComponent, Dispatch, SetStateAction, Context, ReactElement, MutableRefObject } from "react";

/**
 * Field errors object.
 * Keys are field paths, values are error messages or undefined if there is no error.
 * There is also special '_form' error field for general error message
 */
export type FieldErrors = { [field:string]: string }

export interface FormContextProps {
  registeredFields: MutableRefObject<Array<string>>;
  defaultValue: MutableRefObject<Object>;
  value: Object;
  onChange: Dispatch<SetStateAction<Object>>;
  errors: FieldErrors;
  setErrors: Dispatch<SetStateAction<FieldErrors>>;
  validatingFields: Array<string>;
  setValidatingFields: Dispatch<SetStateAction<string>>;
  dirtyFields: Array<string>;
  setDirtyFields: Dispatch<SetStateAction<Array<string>>>;
}
export declare const FormContext: Context<FormContextProps>

export interface FormProps {
  registeredFields: MutableRefObject<Array<string>>;
  defaultValue: MutableRefObject<Object>;
  value?: Object;
  onChange?: (fieldName: string, value: any) => void;
  errors: FieldErrors;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
  /** Array of field paths which are currently validating */
  validatingFields: Array<string>;
  setValidatingFields: Dispatch<SetStateAction<Array<string>>>;
  dirtyFields: Array<string>;
  setDirtyFields: Dispatch<SetStateAction<Array<string>>>;
  children: ReactElement
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
  onSubmit?: (value: Object) => FieldErrors | Promise<FieldErrors>;
}

export interface UseFormResult {
  /**
   * If default value is provided, but value management is
   * supposed to be left to form hook
   */
  value: Object;
  onChange: Dispatch<SetStateAction<Object>>;
  /** Indicates if submi is processing */
  submitting: boolean;
  /** Indicates if async form validation is processing */
  validating: boolean;
  /** Form validation error message */
  error: string | undefined;
  /** Whether one of form's fields has been touched or not */
  dirty: boolean;
  /** Callback which should be passed to submit trigger (Button or html form's onSubmit) */
  onSubmit: Function;
  /** Props which supposed to be passed to Form component. May be intercepted and changed if required. */
  formProps: FormProps;
}

export type useFormType = (options: UseFormOptions) => UseFormResult
export declare function useForm(options: UseFormOptions): UseFormResult

/** Field validate function. If there is error it should return error message, undefined otherwise */
export type ValidateFieldCallback = (value: any, fieldName: string) => string | undefined;

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

export interface FieldComponentProps {
  value: any;
  onChange: (value: any) => void;
  onBlur: Function;
  error: string;
  validating: boolean;
  /** Whether the field has been touched or not */
  dirty: boolean;
}

export type FieldComponent = FunctionComponent<FieldComponentProps>

export declare function withForm(Component: FunctionComponent<UseFormOptions>): FunctionComponent