import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Controls from './Controls';

export default function MonthsViewHeader(props) {
  const {
    styles,
    currentYear,
    textStyle,
    onMonthViewPrevious,
    onMonthViewNext,
    onPressYear
  } = props;
  const year = currentYear;

  return (
    <View style={styles.headerWrapper}>
      <View>
        <Text style={[styles.monthViewLabel, textStyle]}>
          Select Month
        </Text>
      </View>
    </View>
  );
}

MonthsViewHeader.propTypes = {
  currentYear: PropTypes.number,
  onMonthViewNext: PropTypes.func,
  onMonthViewPrevious: PropTypes.func,
  onPressYear: PropTypes.func
};
