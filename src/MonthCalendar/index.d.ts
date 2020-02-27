import { FunctionComponent } from 'react';

export type DayNameComponentType = FunctionComponent<{ day: Object }>;
export type DayComponentType = FunctionComponent<{ day: Object }>;

export interface MonthCalendarProps {
  /** Moment.js object */
  month: Object;
  DayNameComponent?: DayNameComponentType;
  DayComponent?: DayComponentType;
}

export type MonthCalendarType = FunctionComponent<MonthCalendarProps>

declare const MonthCalendar: FunctionComponent<MonthCalendarProps>
export default MonthCalendar