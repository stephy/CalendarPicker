import React, { PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Utils } from './Utils';

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
  } = props;

  const thisDay = new Date(year, month, day);
  const today = new Date();
  let daySelectedStyle = {};
  let dateType;

  // set today's style
  if (Utils.compareDates(thisDay,today)) {
    daySelectedStyle = styles.selectedToday;
  }

  // set selected day style
  if (!allowRangeSelection &&
      selectedStartDate &&
      Utils.compareDates(thisDay,selectedStartDate)) {
    daySelectedStyle = styles.selectedDay;
  }

  // Set selected ranges styles
  if (allowRangeSelection) {
    if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
      if (Utils.compareDates(thisDay,selectedStartDate)) {
        daySelectedStyle = styles.startDayWrapper;
      }
      // Apply style for end date
      if (Utils.compareDates(thisDay,selectedEndDate)) {
        daySelectedStyle = styles.endDayWrapper;
      }
      // Apply style if start date is the same as end date
      if (Utils.compareDates(thisDay, selectedEndDate) &&
          Utils.compareDates(thisDay, selectedStartDate) &&
          Utils.compareDates(selectedEndDate,selectedStartDate)) {
          daySelectedStyle = styles.selectedDay;
      }
      // Apply style if this day is in range
      if (Utils.isDateInRange(thisDay, selectedStartDate, selectedEndDate)) {
        daySelectedStyle = styles.inRangeDay;
      }
    }

    // Apply style if start date has been selected but end date has not
    if (selectedStartDate &&
        !selectedEndDate &&
        Utils.compareDates(thisDay, selectedStartDate)) {
        daySelectedStyle = styles.selectedDay;
    }
  }

  return (
    <View style={styles.dayWrapper}>
      <TouchableOpacity
        style={[styles.dayButton, daySelectedStyle]}
        onPress={() => onPressDay(day) }>
        <Text style={styles.dayLabel}>
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
