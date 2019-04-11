import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import moment from 'moment';

export default function Year(props) {
  const {
    year,
    styles,
    onSelectYear,
    textStyle,
    minDate,
    maxDate,
    disabledDates
  } = props;

  const thisYear = moment({year});

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
    dateIsAfterMax = thisYear.isAfter(maxDate, 'year');
  }
  if (minDate) {
    dateIsBeforeMin = thisYear.isBefore(minDate, 'year');
  }

  if (disabledDates && disabledDates.indexOf(thisYear.valueOf()) >= 0) {
    dateIsDisabled = true;
  }

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateIsBeforeMinDuration || dateIsAfterMaxDuration;
  console.log(year)
  if (!dateOutOfRange) {
    return (
      <View style={[styles.yearWrapper]}>
        <TouchableOpacity
          onPress={() => onSelectYear(year) }>
          <Text style={[styles.yearItemLabel, textStyle]}>
            { year }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  else {  // dateOutOfRange = true
    return (
      <View style={styles.yearWrapper}>
        <Text style={[textStyle, styles.disabledText]}>
          { year }
        </Text>
      </View>
    )
  }
}

Year.propTypes = {
  styles: PropTypes.shape({}),
  year: PropTypes.number,
  onSelectYear: PropTypes.func,
  disabledDates: PropTypes.array,
}