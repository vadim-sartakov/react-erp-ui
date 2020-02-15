import React from 'react';
import moment from 'moment';

const DayName = ({ day }) => {
  return <div className="day-name">{day.format('ddd')}</div>;
};

const Day = ({ day }) => {
  return <div className="day">{day.format('D')}</div>
};

/** @type {import('./').MonthCalendarType} */
const MonthCalendar = ({
  month,
  DayNameComponent = DayName,
  DayComponent = Day
}) => {
  const startDate = moment(month).clone().startOf('month').startOf('week');
  return (
    <div className="month-calendar">
      <div className="days-of-week">
        {Array(7).fill().map((key, index) => {
          const day = startDate.clone().add(index, 'days');
          return <DayNameComponent key={index} day={day} />;
        })}
      </div>
      {Array(5).fill().map((key, weekIndex) => {
        return (
          <div key={weekIndex} className="week">
            {Array(7).fill().map((key, dayIndex) => {
              const day = startDate.clone().add((weekIndex * 7) + dayIndex, 'days');
              return <DayComponent key={dayIndex} day={day} />
            })}
          </div>
        )
      })}
    </div>
  )
};

export default MonthCalendar;