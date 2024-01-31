import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

import { differenceInDays } from 'date-fns/differenceInDays';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isSameDay } from 'date-fns/isSameDay';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { startOfDay } from 'date-fns/startOfDay';
import {Utils} from './Utils'

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
    selectedDayStyle: propSelectedDayStyle,
    selectedDisabledDatesTextStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    textStyle,
    todayTextStyle,
    selectedDayTextStyle: propSelectedDayTextStyle,
    selectedRangeStartTextStyle,
    selectedRangeEndTextStyle,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    isShowLunarCalendar
  } = props;

  const thisDay = new Date(year, month, day, 12);
  const today = new Date();
  const lunar = Utils.getLunarDay({ year, month, day }, isShowLunarCalendar);

  let dateOutOfRange;
  let computedSelectedDayStyle = styles.dayButton; // may be overridden depending on state
  let selectedDayTextStyle = {};
  let selectedDayStyle;
  let overrideOutOfRangeTextStyle;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateRangeLessThanMin = false;
  let dateRangeGreaterThanMax = false;
  let selectedLunarDayTextStyle = {}; // style ngày lễ tết

  // First let's check if date is out of range
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = isAfter(startOfDay(thisDay), startOfDay(maxDate));
  }
  if (minDate) {
    dateIsBeforeMin = isBefore(startOfDay(thisDay), startOfDay(minDate));
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
    let daysDiff = differenceInDays(thisDay, selectedStartDate);  // may be + or -
    daysDiff = allowBackwardRangeSelect ? Math.abs(daysDiff) : daysDiff;

    if (maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        let maxRangeEntry = maxRangeDuration.find(mrd => isSameDay(selectedStartDate, mrd.date));
        if (maxRangeEntry && daysDiff > maxRangeEntry.maxDuration) {
          dateRangeGreaterThanMax = true;
        }
      } else if (daysDiff > maxRangeDuration) {
        dateRangeGreaterThanMax = true;
      }
    }

    if (minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        let minRangeEntry = minRangeDuration.find(mrd => isSameDay(selectedStartDate, mrd.date));
        if (minRangeEntry && daysDiff < minRangeEntry.minDuration) {
          dateRangeLessThanMin = true;
        }
      } else if (daysDiff < minRangeDuration) {
        dateRangeLessThanMin = true;
      }
    }

    if (!allowBackwardRangeSelect && daysDiff < 0) {
      dateRangeLessThanMin = true;
    }
  }

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateRangeLessThanMin || dateRangeGreaterThanMax;

  let isThisDaySameAsSelectedStart = isSameDay(thisDay, selectedStartDate);
  let isThisDaySameAsSelectedEnd = isSameDay(thisDay, selectedEndDate);
  let isThisDateInSelectedRange =
    selectedStartDate
    && selectedEndDate
    && isWithinInterval(thisDay, {
      start: selectedStartDate,
      end: selectedEndDate
    })

  // If date is in range let's apply styles
  if (!dateOutOfRange || isThisDaySameAsSelectedStart || isThisDaySameAsSelectedEnd || isThisDateInSelectedRange) {
    // set today's style
    let isToday = isSameDay(thisDay, today);
    if (isToday) {
      computedSelectedDayStyle = styles.selectedToday;
      // todayTextStyle prop overrides selectedDayTextColor (created via makeStyles)
      selectedDayTextStyle = [todayTextStyle || styles.selectedDayLabel, propSelectedDayTextStyle];
      // lịch âm
      selectedLunarDayTextStyle = styles.selectedDayLabel;
    }

    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });

    if (isToday && custom.style) {
      // Custom date style overrides 'today' style. It may be reset below
      // by date selection styling.
      computedSelectedDayStyle = [styles.selectedToday, custom.style];
    }

    // set selected day style
    if (!allowRangeSelection &&
      selectedStartDate &&
      isThisDaySameAsSelectedStart) {
      computedSelectedDayStyle = styles.selectedDay;
      selectedDayTextStyle = [styles.selectedDayLabel, isToday && todayTextStyle, propSelectedDayTextStyle];
      // selectedDayStyle prop overrides selectedDayColor (created via makeStyles)
      selectedDayStyle = propSelectedDayStyle || styles.selectedDayBackground;

      // lịch âm
      selectedLunarDayTextStyle = styles.selectedDayLabel;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
        if (isThisDaySameAsSelectedStart) {
          computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];

          // lịch âm
          selectedLunarDayTextStyle = styles.selectedDayLabel;
        }
        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          computedSelectedDayStyle = [styles.endDayWrapper, selectedRangeStyle, selectedRangeEndStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeEndTextStyle];

          // lịch âm
          selectedLunarDayTextStyle = styles.selectedDayLabel;
        }
        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd &&
          isThisDaySameAsSelectedStart &&
          isSameDay(selectedEndDate, selectedStartDate)) {
          computedSelectedDayStyle = [styles.selectedDay, styles.selectedDayBackground, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];

          // lịch âm
          selectedLunarDayTextStyle = styles.selectedDayLabel;
        }
        // Apply style for days inside of range, excluding start & end dates.
        if (!isThisDaySameAsSelectedEnd &&
          !isThisDaySameAsSelectedStart &&
          isWithinInterval(thisDay, { start: selectedStartDate, end: selectedEndDate })) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle];

          // lịch âm
          selectedLunarDayTextStyle = styles.selectedDayLabel;
        }
      }
      // Apply style if start date has been selected but end date has not
      if (selectedStartDate &&
        !selectedEndDate &&
        isThisDaySameAsSelectedStart) {
        computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
        selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        // Override out of range start day text style when minRangeDuration = 1.
        // This allows selected start date's text to be styled by selectedRangeStartTextStyle
        // even when it's below minRangeDuration.
        overrideOutOfRangeTextStyle = selectedRangeStartTextStyle;

        // lịch âm
        selectedLunarDayTextStyle = styles.selectedDayLabel;
      }
    }

    if (dateOutOfRange) { // start or end date selected, and this date outside of range.
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <View style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}>
            <Text style={[styles.dayLabel, textStyle,
            styles.disabledText, disabledDatesTextStyle,
            styles.selectedDisabledText, selectedDisabledDatesTextStyle,
              overrideOutOfRangeTextStyle
            ]}>
              {day}
            </Text>
            {
              lunar ? <Text style={[styles.txtLunar, selectedLunarDayTextStyle]}>{lunar}</Text>: null
            }
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <TouchableOpacity
            disabled={!enableDateChange}
            style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}
            onPress={() => onPressDay({ year, month, day })}>
            <Text style={[styles.dayLabel, textStyle, custom.textStyle, selectedDayTextStyle]}>
            {day}
            </Text>
            {
              lunar ? <Text style={[styles.txtLunar, selectedLunarDayTextStyle]}>{lunar}</Text>: null
            }
          </TouchableOpacity>
        </View>
      );
    }
  }
  else {  // dateOutOfRange = true, and no selected start or end date.
    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });
    // Allow customDatesStyles to override disabled dates if allowDisabled set
    if (!custom.allowDisabled) {
      custom.containerStyle = null;
      custom.style = null;
      custom.textStyle = null;
    }
    return (
      <View style={[styles.dayWrapper, custom.containerStyle]}>
        <View style={[styles.dayButton, custom.style]}>
          <Text style={[{ textAlign: "center" },textStyle, styles.disabledText, disabledDatesTextStyle, custom.textStyle]}>
          {day}
          </Text>
          {
            lunar ? <Text style={[styles.txtLunar, selectedLunarDayTextStyle]}>{lunar}</Text>: null
          }
        </View>
      </View>
    );
  }
}

function getCustomDateStyle({ customDatesStyles, date }) {
  if (Array.isArray(customDatesStyles)) {
    for (let cds of customDatesStyles) {
      if (isSameDay(date, new Date(cds.date))) {
        return { ...cds };
      }
    }
  }
  else if (customDatesStyles instanceof Function) {
    let cds = customDatesStyles(date) || {};
    return { ...cds };
  }
  return {};
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
