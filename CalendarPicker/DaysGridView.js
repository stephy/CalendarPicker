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
    selectedDayStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    customDatesStyles,
    minDate,
    maxDate,
    disabledDates,
    minRangeDuration,
    maxRangeDuration,
    theme,
    dateFormat,
    markedDates,
  } = props;
  // let's get the total of days in this month, we need the year as well, since
  // leap years have different amount of days in February
  const totalDays = Utils.getDaysInMonth(month, year);
  // Let's create a date for day one of the current given month and year
  const firstDayOfMonth = moment({ year, month, day: 1 });
  // The weekday() method returns the day of the week (from 0 to 6) for the specified date.
  // Note: Sunday is 0, Monday is 1, and so on. We will need this to know what
  // day of the week to show day 1
  // timezone issue fix:
  // use isoWeekday() instead of weekday() to get the consistent weekday of all locale
  const firstWeekDay = firstDayOfMonth.isoWeekday();
  // fill up an array of days with the amount of days in the current month
  const days = Array.apply(null, {length: totalDays}).map(Number.call, Number);
  const guideArray = [ 0, 1, 2, 3, 4, 5, 6 ];

  // Get the starting index, based upon whether we are using monday or sunday as first day.
  const startIndex = (startFromMonday) ? (firstWeekDay - 1) % 7 : firstWeekDay;

  function generateColumns(i) {
    const column = guideArray.map(index => {
      if (i === 0) { // for first row, let's start showing the days on the correct weekday
        if (index >= startIndex) {
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
                disabledDates={disabledDates}
                minRangeDuration={minRangeDuration}
                maxRangeDuration={maxRangeDuration}
                selectedDayStyle={selectedDayStyle}
                selectedRangeStartStyle={selectedRangeStartStyle}
                selectedRangeStyle={selectedRangeStyle}
                selectedRangeEndStyle={selectedRangeEndStyle}
                customDatesStyles={customDatesStyles}
                theme={theme}
                dateFormat={dateFormat}
                markedDates={markedDates}
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
              disabledDates={disabledDates}
              minRangeDuration={minRangeDuration}
              maxRangeDuration={maxRangeDuration}
              selectedDayStyle={selectedDayStyle}
              selectedRangeStartStyle={selectedRangeStartStyle}
              selectedRangeStyle={selectedRangeStyle}
              selectedRangeEndStyle={selectedRangeEndStyle}
              customDatesStyles={customDatesStyles}
              theme={theme}
              dateFormat={dateFormat}
              markedDates={markedDates}
            />
          );
        }
      }

    });
    return column;
  }
  return (
    <View style={[styles.daysWrapper, { paddingBottom: 20 }]}>
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
  selectedDayStyle: ViewPropTypes.style,
  selectedRangeStartStyle: ViewPropTypes.style,
  selectedRangeStyle: ViewPropTypes.style,
  selectedRangeEndStyle: ViewPropTypes.style,
  customDatesStyles: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment)
    ]),
    containerStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
  })),
  disabledDates: PropTypes.array,
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
}
