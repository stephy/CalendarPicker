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

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled;

  return (
    <View style={[styles.yearContainer]}>
      { !dateOutOfRange ?
        <TouchableOpacity
          onPress={() => onSelectYear(year) }>
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
