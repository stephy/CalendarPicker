import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import { getMonth, getYear } from 'date-fns';

export default function Month(props) {
  const {
    months,
    currentMonth: month,
    currentYear: year,
    styles,
    onSelectMonth,
    textStyle,
    minDate,
    maxDate,
  } = props;

  const MONTHS = months || Utils.MONTHS; // English Month Array
  const monthName = MONTHS[month];

  let monthOutOfRange;
  let monthIsBeforeMin = false;
  let monthIsAfterMax = false;
  let monthIsDisabled = false;

  // Check whether month is outside of min/max range.
  if (maxDate && (getYear(maxDate) === year)) {
    monthIsAfterMax = month > getMonth(maxDate);
  }
  if (minDate && (getYear(minDate) === year)) {
    monthIsBeforeMin = month < getMonth(month);
  }

  // ToDo: disabledMonths props to disable months separate from disabledDates

  monthOutOfRange = monthIsAfterMax || monthIsBeforeMin || monthIsDisabled;

  const onSelect = () => {
    let _year = year;
    if (minDate && (year < getYear(minDate))) {
      _year = getYear(minDate);
    }
    if (maxDate && (year > getYear(maxDate))) {
      _year = getYear(maxDate);
    }
    onSelectMonth({ month, year: _year });
  };

  return (
    <View style={[styles.monthContainer]}>
      {!monthOutOfRange ?
        <TouchableOpacity
          onPress={onSelect}>
          <Text style={[styles.monthText, textStyle]}>
            {monthName}
          </Text>
        </TouchableOpacity>
        :
        <Text style={[textStyle, styles.disabledText]}>
          {monthName}
        </Text>
      }
    </View>
  );
}

Month.propTypes = {
  styles: PropTypes.shape({}),
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onSelectMonth: PropTypes.func,
};
