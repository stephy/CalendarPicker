import React from 'react'; 
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  View,
  Text,
} from 'react-native';
import Day from './Day';
import EmptyDay from './EmptyDay';
import { Utils } from './Utils';

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
    textStyle,
    minDate,
    maxDate,
  } = props;
  const today = new Date();
  // let's get the total of days in this month, we need the year as well, since
  // leap years have different amount of days in February
  const totalDays = Utils.getDaysInMonth(month, year);
  // Let's create a date for day one of the current given month and year
  const firstDayOfMonth = startFromMonday ? new Date(year, month, 0) : new Date(year, month, 1);
  // The getDay() method returns the day of the week (from 0 to 6) for the specified date.
  // Note: Sunday is 0, Monday is 1, and so on. We will need this to know what
  // day of the week to show day 1
  const firstWeekDay = firstDayOfMonth.getDay();
  // fill up an array of days with the amount of days in the current month
  const days = Array.apply(null, {length: totalDays}).map(Number.call, Number);
  const guideArray = [ 0, 1, 2, 3, 4, 5, 6 ];

  function generateColumns(i) {
    const column = guideArray.map(index => {
      if (i === 0) { // for first row, let's start showing the days on the correct weekday
        if (index >= firstWeekDay) {
          if (days.length > 0) {
            const day= days.shift() + 1;
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
                minDate={minDate}
                maxDate={maxDate}
                textStyle={textStyle}
              />
            );
          }
        } else {
          return (
            <EmptyDay
              key={uuid()}
              styles={styles}
            />
          );
        }
      } else {
        if (days.length > 0) {
          const day= days.shift() + 1;
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
              minDate={minDate}
              maxDate={maxDate}
              textStyle={textStyle}
            />
          );
        }
      }

    });
    return column;
  }
  return (
    <View style={styles.daysWrapper}>
      { guideArray.map(index => (
          <View key={index} style={styles.weekRow}>
            { generateColumns(index) }
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
}
