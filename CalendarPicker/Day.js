import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import moment from 'moment';

export default function Day(props) {
  const {
    day,
    month,
    year,
    styles,
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    textStyle,
    minDate,
    maxDate,
  } = props;

  const thisDay = moment({year, month, day});
  const today = moment();

  let dateOutOfRange;
  let daySelectedStyle = {};
  let selectedDayColorStyle = {};
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;

  // First let's check if date is out of range.
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = thisDay.isAfter(maxDate, 'day');
  }
  if (minDate) {
    dateIsBeforeMin = thisDay.isBefore(minDate, 'day');
  }
  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin;

  // If date is in range let's apply styles
  if (!dateOutOfRange) {
    // set today's style
    if (thisDay.isSame(today, 'day')) {
      daySelectedStyle = styles.selectedToday;
      selectedDayColorStyle = styles.selectedDayLabel;
    }

    let isThisDaySameAsSelectedStart = thisDay.isSame(selectedStartDate, 'day');
    let isThisDaySameAsSelectedEnd = thisDay.isSame(selectedEndDate, 'day');

    // set selected day style
    if (!allowRangeSelection &&
        selectedStartDate &&
        isThisDaySameAsSelectedStart) {
      daySelectedStyle = styles.selectedDay;
      selectedDayColorStyle = styles.selectedDayLabel;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
          // Apply style for start date
        if (thisDay.isSame(selectedStartDate, 'day')) {
          daySelectedStyle = styles.startDayWrapper;
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          daySelectedStyle = styles.endDayWrapper;
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd &&
            isThisDaySameAsSelectedStart &&
            selectedEndDate.isSame(selectedStartDate, 'day')) {
            daySelectedStyle = styles.selectedDay;
            selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if this day is in range
        if (thisDay.isSameOrAfter(selectedStartDate, 'day') && thisDay.isSameOrBefore(selectedEndDate, 'day')) {
          daySelectedStyle = styles.inRangeDay;
          selectedDayColorStyle = styles.selectedDayLabel;
        }
      }
      // Apply style if start date has been selected but end date has not
      if (selectedStartDate &&
          !selectedEndDate &&
          isThisDaySameAsSelectedStart) {
          daySelectedStyle = styles.selectedDay;
          selectedDayColorStyle = styles.selectedDayLabel;
      }
    }
  }

  if (dateOutOfRange) {
    return (
      <View style={styles.dayWrapper}>
        <Text style={[textStyle, styles.disabledText]}>
          { day }
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.dayWrapper}>
      <TouchableOpacity
        style={[styles.dayButton, daySelectedStyle]}
        onPress={() => onPressDay(day) }>
        <Text style={[styles.dayLabel, textStyle, selectedDayColorStyle]}>
          { day }
        </Text>
      </TouchableOpacity>
    </View>
  );
}

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
}
