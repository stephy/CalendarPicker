import React from 'react';
import uuid from 'uuid/v4';
import {
  View,
  Text,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Day from './Day';
import EmptyDay from './EmptyDay';
import { Utils } from './Utils';
import moment from 'moment';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default function DaysGridView(props) {
  const {
    month,
    year,
    styles,
    onPressDay,
    startFromMonday,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    textStyle,
    todayTextStyle,
    selectedDayStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    customDatesStyles,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    showDayStragglers,
  } = props;

  // let's get the total of days in this month, we need the year as well, since
  // leap years have different amount of days in February
  const totalDays = Utils.getDaysInMonth(month, year);

  // Calculate days in prev month for day stragglers.
  let totalDaysPrevMonth, prevMonth, prevMonthYear, dayNextMonth;
  if (showDayStragglers) {
    prevMonth = month - 1;
    prevMonthYear = year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevMonthYear--;
    }
    totalDaysPrevMonth = Utils.getDaysInMonth(prevMonth, prevMonthYear);
    // Next month's day always starts at 1 and never overflows
    dayNextMonth = 1;
  }

  // Let's create a date for day one of the current given month and year
  const firstDayOfMonth = moment({ year, month, day: 1 });

  // isoWeekday() gets the ISO day of the week with 1 being Monday and 7 being Sunday.
  // We will need this to know what day of the week to show day 1
  // See https://github.com/stephy/CalendarPicker/issues/49
  const firstWeekDay = firstDayOfMonth.isoWeekday();

  // fill up an array of days with the amount of days in the current month
  const days = Array.apply(null, {length: totalDays}).map(Number.call, Number);

  // 7 days in a week.
  const dayArray = [ 0, 1, 2, 3, 4, 5, 6 ];

  // There can be 4 to 6 rows of weeks in a month.
  const weekArray = [ 0, 1, 2, 3, 4, 5 ];

  // Get the starting index, based upon whether we are using monday or sunday as first day.
  const startIndex = (startFromMonday ? firstWeekDay - 1 : firstWeekDay) % 7;

  function renderDayInCurrentMonth() {
    const day = days.shift() + 1;
    return (
      <Day
        key={day}
        day={day}
        month={month}
        year={year}
        styles={styles}
        onPressDay={onPressDay}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        allowRangeSelection={allowRangeSelection}
        allowBackwardRangeSelect={allowBackwardRangeSelect}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        disabledDatesTextStyle={disabledDatesTextStyle}
        minRangeDuration={minRangeDuration}
        maxRangeDuration={maxRangeDuration}
        textStyle={textStyle}
        todayTextStyle={todayTextStyle}
        selectedDayStyle={selectedDayStyle}
        selectedRangeStartStyle={selectedRangeStartStyle}
        selectedRangeStyle={selectedRangeStyle}
        selectedRangeEndStyle={selectedRangeEndStyle}
        customDatesStyles={customDatesStyles}
        enableDateChange={enableDateChange}
      />
    );
  }

  function renderDayStraggler({key, day}) {
    return (
      <Day
        key={key}
        day={day}
        styles={styles}
        disabledDates={() => true}
        disabledDatesTextStyle={disabledDatesTextStyle}
        textStyle={textStyle}
      />
    );
  }


  function generateDatesForWeek(i) {
    let lastFilledRow = 0;
    return dayArray.map(dayIndex => {
      if (i === 0) {
        // first row: start current month's day on the correct weekday
        if (dayIndex >= startIndex) {
          if (days.length > 0) {
            return renderDayInCurrentMonth();
          }
        } else {
          return showDayStragglers ?
            // Show previous month's days
            renderDayStraggler({
              key: '' + i + dayIndex,
              day: totalDaysPrevMonth - startIndex + dayIndex + 1,
            })
            :
            ( //... otherwise blank
              <EmptyDay
                key={uuid()}
                styles={styles}
              />
            );
        }
      } else {
        if (days.length > 0) {
          lastFilledRow = i;
          return renderDayInCurrentMonth();
        }
        else if (showDayStragglers && i <= lastFilledRow) {
          // Show next month's days
          return renderDayStraggler({
            key: '' + i + dayIndex,
            day: dayNextMonth++,
          });
        }
      }
    });
  }

  return (
    <View style={styles.daysWrapper}>
      { weekArray.map(weekIndexOfMonth => (
        <View key={weekIndexOfMonth} style={styles.weekRow}>
          { generateDatesForWeek(weekIndexOfMonth) }
        </View>
      ))
      }
    </View>
  );
}

DaysGridView.propTypes = {
  styles: PropTypes.shape(),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onPressDay: PropTypes.func,
  startFromMonday: PropTypes.bool,
  selectedDayStyle: ViewPropTypes.style,
  selectedRangeStartStyle: ViewPropTypes.style,
  selectedRangeStyle: ViewPropTypes.style,
  selectedRangeEndStyle: ViewPropTypes.style,
  todayTextStyle: Text.propTypes.style,
  customDatesStyles: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment)
      ]),
      containerStyle: ViewPropTypes.style,
      style: ViewPropTypes.style,
      textStyle: Text.propTypes.style,
    })),
  ]),
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  disabledDatesTextStyle: Text.propTypes.style,
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
};
