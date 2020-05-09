import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

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
    // disabledDates
  } = props;

  let yearOutOfRange;
  let yearIsBeforeMin = false;
  let yearIsAfterMax = false;
  let yearIsDisabled = false;

  // Check whether year is outside of min/max range.
  if (maxDate) {
    yearIsAfterMax = year > maxDate.year();
  }
  if (minDate) {
    yearIsBeforeMin = year < minDate.year();
  }

  // ToDo: disabledDates is tricky because a year may have partially disabled dates
  // while still selectable. The code would need to check every day of the year
  // to know whether a year should be disabled.

  yearOutOfRange = yearIsAfterMax || yearIsBeforeMin || yearIsDisabled;

  const onSelect = () => {
    // Guard against navigating to months beyond min/max dates.
    let month = currentMonth;
    let currentMonthYear = moment({year: currentYear, month});
    if (maxDate && currentMonthYear.isAfter(maxDate, 'month')) {
      month = maxDate.month();
    }
    if (minDate && currentMonthYear.isBefore(minDate, 'month')) {
      month = minDate.month();
    }
    onSelectYear({month, year});
  };

  return (
    <View style={[styles.yearContainer]}>
      { !yearOutOfRange ?
        <TouchableOpacity
          onPress={onSelect}>
          <Text style={[styles.yearText, textStyle]}>
            { year }
          </Text>
        </TouchableOpacity>
        :
        <Text style={[textStyle, styles.disabledText]}>
          { year }
        </Text>
      }
    </View>
  );
}

Year.propTypes = {
  styles: PropTypes.shape({}),
  year: PropTypes.number,
  onSelectYear: PropTypes.func,
  disabledDates: PropTypes.array,
};
