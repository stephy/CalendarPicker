import React, { PropTypes } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Utils } from "./Utils";

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
    isMark,
    selectedMarkedDaysColorStyle,
    selectedMarkedDaysTextColorStyle,
    startDayStyle,
    endDayStyle
  } = props;

  const thisDay = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dateOutOfRange = false;
  let daySelectedStyle = {};
  let selectedDayColorStyle = {};
  let dateType;

  // First let's check if date is out of range
  if (minDate) {
    if (thisDay < minDate) {
      dateOutOfRange = true;
    }
  }

  if (maxDate) {
    if (thisDay > maxDate) {
      dateOutOfRange = true;
    }
  }

  // If date is not out of range let's apply styles
  if (!dateOutOfRange) {
    // set today's style
    if (Utils.compareDates(thisDay, today)) {
      daySelectedStyle = styles.selectedToday;
      selectedDayColorStyle = styles.selectedDayLabel;
    }

    // set selected day style
    if (
      !allowRangeSelection &&
      selectedStartDate &&
      Utils.compareDates(thisDay, selectedStartDate)
    ) {
      daySelectedStyle = styles.selectedDay;
      selectedDayColorStyle = styles.selectedDayLabel;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
        if (Utils.compareDates(thisDay, selectedStartDate)) {
          daySelectedStyle = {
            ...styles.startDayWrapper,
            ...props.startDayStyle
          };
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style for end date
        if (Utils.compareDates(thisDay, selectedEndDate)) {
          daySelectedStyle = {
            ...styles.endDayWrapper,
            ...props.endDayStyle
          };
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if start date is the same as end date
        if (
          Utils.compareDates(thisDay, selectedEndDate) &&
          Utils.compareDates(thisDay, selectedStartDate) &&
          Utils.compareDates(selectedEndDate, selectedStartDate)
        ) {
          daySelectedStyle = styles.selectedDay;
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if this day is in range
        if (Utils.isDateInRange(thisDay, selectedStartDate, selectedEndDate)) {
          daySelectedStyle = styles.inRangeDay;
          selectedDayColorStyle = styles.selectedDayLabel;
        }
      }
      // Apply style if start date has been selected but end date has not
      if (
        selectedStartDate &&
        !selectedEndDate &&
        Utils.compareDates(thisDay, selectedStartDate)
      ) {
        daySelectedStyle = styles.selectedDay;
        selectedDayColorStyle = styles.selectedDayLabel;
      }
    }
  }

  if (dateOutOfRange) {
    return (
      <View style={styles.dayWrapper}>
        <Text style={[textStyle, styles.disabledText]}>
          {day}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.dayWrapper}>
      <TouchableOpacity
        style={[
          styles.dayButton,
          isMark
            ? { ...styles.circleDayButton, ...selectedMarkedDaysColorStyle }
            : {},
          daySelectedStyle
        ]}
        onPress={() => onPressDay(day)}
      >
        <Text
          style={[
            styles.dayLabel,
            textStyle,
            selectedDayColorStyle,
            isMark ? selectedMarkedDaysTextColorStyle : {}
          ]}
        >
          {day}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func
};
