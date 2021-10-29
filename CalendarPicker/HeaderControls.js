import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Animated
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import Controls from './Controls';

export default function HeaderControls(props) {
  const {
    styles,
    currentMonth,
    currentYear,
    currentView,
    onPressNext,
    onPressPrevious,
    onPressMonth,
    onPressYear,
    onPressMonthYear,
    months,
    previousComponent,
    nextComponent,
    previousTitle,
    nextTitle,
    previousTitleStyle,
    nextTitleStyle,
    monthTitleStyle,
    yearTitleStyle,
    textStyle,
    restrictMonthNavigation,
    maxDate,
    minDate,
    headingLevel,
    monthYearHeaderWrapperStyle,
    headerWrapperStyle
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
    <View style={[styles.headerWrapper]}>
      <View style={[styles.monthYearHeaderWrapper, monthYearHeaderWrapperStyle]}>
        <TouchableOpacity onPress={onPressMonthYear}>
          <Text style={[styles.monthHeaderMainText, textStyle, monthTitleStyle]} {...accessibilityProps}>
            { monthName }
            {'  '}
            { year }
          </Text>
          <Animated.View style={[{position: 'absolute', right: -14, top: 2}, {transform: [{ rotate: currentView === 'monthYear'? '90deg': '0deg'}, {scale: 0.8}]}]}>
           {nextComponent}
          </Animated.View>
        </TouchableOpacity>
      </View>
      {currentView !== 'monthYear' ? <View style={{display:'flex', flexDirection: 'row', flex: 1, justifyContent:'flex-end'}}>
        <Controls
          disabled={disablePreviousMonth}
          label={previousTitle}
          component={previousComponent}
          onPressControl={onPressPrevious}
          styles={styles.previousContainer}
          textStyles={[styles.navButtonText, textStyle, previousTitleStyle]}
        />
        <Controls
          disabled={disableNextMonth}
          label={nextTitle}
          component={nextComponent}
          onPressControl={onPressNext}
          styles={styles.nextContainer}
          textStyles={[styles.navButtonText, textStyle, nextTitleStyle]}
        />
      </View> : null}
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
