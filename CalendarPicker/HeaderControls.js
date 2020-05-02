import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import Controls from './Controls';

export default function HeaderControls(props) {
  const {
    styles,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    onPressMonth,
    onPressYear,
    months,
    previousTitle,
    nextTitle,
    textStyle,
    restrictMonthNavigation,
    maxDate,
    minDate,
    headingLevel,
    previousTitleStyle,
    nextTitleStyle,
  } = props;
  const MONTHS = months || Utils.MONTHS; // English Month Array
  const monthName = MONTHS[currentMonth];
  const year = currentYear;

  const disablePreviousMonth = restrictMonthNavigation && Utils.isSameMonthAndYear(minDate, currentMonth, currentYear);
  const disableNextMonth = restrictMonthNavigation && Utils.isSameMonthAndYear(maxDate, currentMonth, currentYear);

  const accessibilityProps = { accessibilityRole: 'header' };
  if (Platform.OS === 'web') {
    accessibilityProps['aria-level'] = headingLevel;
  }

  return (
    <View style={styles.headerWrapper}>
      <Controls
        disabled={disablePreviousMonth}
        label={previousTitle}
        onPressControl={onPressPrevious}
        styles={[styles.monthSelector, styles.prev]}
        textStyles={[textStyle, previousTitleStyle]}
      />
      <TouchableOpacity onPress={onPressMonth}>
        <Text style={[styles.monthHeaderMainText, textStyle]} {...accessibilityProps}>
          { monthName }
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressYear}>
        <Text style={[styles.yearHeaderMainText, textStyle]}>
          { year }
        </Text>
      </TouchableOpacity>
      <Controls
        disabled={disableNextMonth}
        label={nextTitle}
        onPressControl={onPressNext}
        styles={[styles.monthSelector, styles.next]}
        textStyles={[textStyle, nextTitleStyle]}
      />
    </View>
  );
}

HeaderControls.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
  onPressMonth: PropTypes.func,
  onPressYear: PropTypes.func,
};
