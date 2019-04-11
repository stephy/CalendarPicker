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
    month,
    year,
    styles,
    onSelectMonth,
    textStyle,
    minDate,
    maxDate,
    disabledDates
  } = props;
  const months = Utils.MONTHS;

  const thisMonth = moment({year, month});

  let dateOutOfRange;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateIsBeforeMinDuration = false;
  let dateIsAfterMaxDuration = false;

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

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateIsBeforeMinDuration || dateIsAfterMaxDuration;

  if (!dateOutOfRange) {
    return (
      <View style={[styles.monthWrapper]}>
        <TouchableOpacity
          onPress={() => onSelectMonth(month) }>
          <Text style={[styles.monthItemLabel, textStyle]}>
            { months[month] }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  else {  // dateOutOfRange = true
    return (
      <View style={styles.monthWrapper}>
        <Text style={[textStyle, styles.disabledText]}>
          { months[month] }
        </Text>
      </View>
    )
  }
}

Month.propTypes = {
  styles: PropTypes.shape({}),
  month: PropTypes.number,
  onSelectMonth: PropTypes.func,
  disabledDates: PropTypes.array,
}