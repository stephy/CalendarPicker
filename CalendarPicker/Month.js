import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import moment from 'moment';

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
    disabledDates
  } = props;

  const MONTHS = months || Utils.MONTHS; // English Month Array
  const monthName = MONTHS[month];

  const thisMonth = moment({year, month});

  let dateOutOfRange;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;

  // First let's check if date is out of range
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = thisMonth.isAfter(maxDate, 'month');
  }
  if (minDate) {
    dateIsBeforeMin = thisMonth.isBefore(minDate, 'month');
  }

  if (disabledDates && disabledDates.indexOf(thisMonth.valueOf()) >= 0) {
    dateIsDisabled = true;
  }

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled;

  return (
    <View style={[styles.monthContainer]}>
      { !dateOutOfRange ?
        <TouchableOpacity
          onPress={() => onSelectMonth(month) }>
          <Text style={[styles.monthText, textStyle]}>
            { monthName }
          </Text>
        </TouchableOpacity>
        :
        <Text style={[textStyle, styles.disabledText]}>
          { monthName }
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
  disabledDates: PropTypes.array,
};
