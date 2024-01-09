import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { getMonth, getYear, isAfter, isBefore, startOfMonth } from 'date-fns';

export default function Year(props) {
  const {
    year,
    currentMonth,
    currentYear,
    styles,
    onSelectYear,
    textStyle,
    minDate,
    maxDate,
  } = props;

  let yearOutOfRange;
  let yearIsBeforeMin = false;
  let yearIsAfterMax = false;
  let yearIsDisabled = false;

  // Check whether year is outside of min/max range.
  if (maxDate) {
    yearIsAfterMax = year > getYear(maxDate);
  }
  if (minDate) {
    yearIsBeforeMin = year < getYear(minDate);
  }

  // ToDo: disabledYears props to disable years separate from disabledDates

  yearOutOfRange = yearIsAfterMax || yearIsBeforeMin || yearIsDisabled;

  const onSelect = () => {
    // Guard against navigating to months beyond min/max dates.
    let month = currentMonth;
    let currentMonthYear = new Date(currentYear, month);
    if (maxDate && isAfter(currentMonthYear, startOfMonth(maxDate))) {
      month = getMonth(maxDate);
    }
    if (minDate && isBefore(currentMonthYear, startOfMonth(minDate))) {
      month = getMonth(minDate);
    }
    onSelectYear({ month, year });
  };

  return (
    <View style={[styles.yearContainer]}>
      {!yearOutOfRange ?
        <TouchableOpacity
          onPress={onSelect}>
          <Text style={[styles.yearText, textStyle]}>
            {year}
          </Text>
        </TouchableOpacity>
        :
        <Text style={[textStyle, styles.disabledText]}>
          {year}
        </Text>
      }
    </View>
  );
}

Year.propTypes = {
  styles: PropTypes.shape({}),
  year: PropTypes.number,
  onSelectYear: PropTypes.func,
};
