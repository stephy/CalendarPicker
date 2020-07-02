import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Day(props) {
  const {
    day,
    month,
    year,
    styles,
    customDatesStyles,
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    selectedDayStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    textStyle,
    todayTextStyle,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange
  } = props;

  const thisDay = moment({year, month, day, hour: 12 });
  const today = moment();

  let dateOutOfRange;
  let daySelectedStyle = styles.dayButton; // may be overridden depending on state
  let selectedDayColorStyle = {};
  let propSelectedDayStyle;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateRangeLessThanMin = false;
  let dateRangeGreaterThanMax = false;
  let customContainerStyle, customDateStyle, customTextStyle;

  // First let's check if date is out of range
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = thisDay.isAfter(maxDate, 'day');
  }
  if (minDate) {
    dateIsBeforeMin = thisDay.isBefore(minDate, 'day');
  }

  if (disabledDates) {
    if (Array.isArray(disabledDates) && disabledDates.indexOf(thisDay.valueOf()) >= 0) {
      dateIsDisabled = true;
    }
    else if (disabledDates instanceof Function) {
      dateIsDisabled = disabledDates(thisDay);
    }
  }

  if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
    let daysDiff = thisDay.diff(selectedStartDate, 'days'); // may be + or -
    daysDiff = allowBackwardRangeSelect ? Math.abs(daysDiff) : daysDiff;

    if (maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        let maxRangeEntry = maxRangeDuration.find(mrd => selectedStartDate.isSame(mrd.date, 'day') );
        if (maxRangeEntry && daysDiff > maxRangeEntry.maxDuration) {
          dateRangeGreaterThanMax = true;
        }
      } else if(daysDiff > maxRangeDuration) {
        dateRangeGreaterThanMax = true;
      }
    }

    if (minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        let minRangeEntry = minRangeDuration.find(mrd => selectedStartDate.isSame(mrd.date, 'day') );
        if (minRangeEntry && daysDiff < minRangeEntry.minDuration && daysDiff !== 0) {
          dateRangeLessThanMin = true;
        }
      } else if(daysDiff < minRangeDuration && daysDiff !== 0) {
        dateRangeLessThanMin = true;
      }
    }

    if (!allowBackwardRangeSelect && daysDiff < 0) {
      dateRangeLessThanMin = true;
    }
  }

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateRangeLessThanMin || dateRangeGreaterThanMax;

  // If date is in range let's apply styles
  if (!dateOutOfRange) {
    // set today's style
    let isToday = thisDay.isSame(today, 'day');
    if (isToday) {
      daySelectedStyle = styles.selectedToday;
      // todayTextStyle prop overrides selectedDayTextColor (created via makeStyles)
      selectedDayColorStyle = todayTextStyle || styles.selectedDayLabel;
    }

    if (Array.isArray(customDatesStyles)) {
      for (let cds of customDatesStyles) {
        if (thisDay.isSame(moment(cds.date), 'day')) {
          customContainerStyle = cds.containerStyle;
          customDateStyle = cds.style;
          customTextStyle = cds.textStyle;
          break;
        }
      }
    }
    else if (customDatesStyles instanceof Function) {
      let cds = customDatesStyles(thisDay) || {};
      customContainerStyle = cds.containerStyle;
      customDateStyle = cds.style;
      customTextStyle = cds.textStyle;
    }
    if (isToday && customDateStyle) {
      // Custom date style overrides 'today' style. It may be reset below
      // by date selection styling.
      daySelectedStyle = [daySelectedStyle, customDateStyle];
    }

    let isThisDaySameAsSelectedStart = thisDay.isSame(selectedStartDate, 'day');
    let isThisDaySameAsSelectedEnd = thisDay.isSame(selectedEndDate, 'day');

    // set selected day style
    if (!allowRangeSelection &&
        selectedStartDate &&
        isThisDaySameAsSelectedStart) {
      daySelectedStyle = styles.selectedDay;
      selectedDayColorStyle = [styles.selectedDayLabel, isToday && todayTextStyle];
      // selectedDayStyle prop overrides selectedDayColor (created via makeStyles)
      propSelectedDayStyle = selectedDayStyle || styles.selectedDayBackground;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
        if (isThisDaySameAsSelectedStart) {
          daySelectedStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          daySelectedStyle = [styles.endDayWrapper, selectedRangeStyle, selectedRangeEndStyle];
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd &&
            isThisDaySameAsSelectedStart &&
            selectedEndDate.isSame(selectedStartDate, 'day')) {
          daySelectedStyle = [styles.selectedDay, styles.selectedDayBackground, selectedRangeStyle];
          selectedDayColorStyle = styles.selectedDayLabel;
        }
        // Apply style if this day is in range
        if (thisDay.isBetween(selectedStartDate, selectedEndDate, 'day')) {
          daySelectedStyle = [styles.inRangeDay, selectedRangeStyle];
          selectedDayColorStyle = styles.selectedDayLabel;
        }
      }
      // Apply style if start date has been selected but end date has not
      if (selectedStartDate &&
          !selectedEndDate &&
          isThisDaySameAsSelectedStart) {
        daySelectedStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
        selectedDayColorStyle = styles.selectedDayLabel;
      }
    }

    return (
      <View style={[styles.dayWrapper, customContainerStyle]}>
        <TouchableOpacity
          disabled={!enableDateChange}
          style={[customDateStyle, daySelectedStyle, propSelectedDayStyle ]}
          onPress={() => onPressDay(day) }>
          <Text style={[styles.dayLabel, textStyle, customTextStyle, selectedDayColorStyle]}>
            { day }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  else {  // dateOutOfRange = true
    return (
      <View style={styles.dayWrapper}>
        <Text style={[textStyle, styles.disabledText, disabledDatesTextStyle]}>
          { day }
        </Text>
      </View>
    );
  }
}

Day.defaultProps = {
  customDatesStyles: [],
};

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
};
