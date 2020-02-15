import { FunctionComponent } from 'react';
import { Moment } from 'moment';

export type DayNameComponentType = FunctionComponent<{ day: Moment }>;
export type DayComponentType = FunctionComponent<{ day: Moment }>;

export interface MonthCalendarProps {
  month: Moment;
  DayNameComponent?: DayNameComponentType;
  DayComponent?: DayComponentType;
}

export type MonthCalendarType = FunctionComponent<MonthCalendarProps>