import React from 'react';
import {
  View,
  Text,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Controls from './Controls';

export default function YearsHeader(props) {
  const {
    title,
    currentYear,
    maxDate,
    minDate,
    restrictNavigation,
    styles,
    textStyle,
    previousTitle,
    nextTitle,
    previousTitleStyle,
    nextTitleStyle,
    onYearViewPrevious,
    onYearViewNext,
    headingLevel,
  } = props;

  const disablePrevious = restrictNavigation && (minDate.year() >= currentYear);
  const disableNext = restrictNavigation && (maxDate.year() <= currentYear);

  const accessibilityProps = { accessibilityRole: 'header' };
  if (Platform.OS === 'web') {
    accessibilityProps['aria-level'] = headingLevel;
  }

  return (
    <View style={styles.headerWrapper}>
      <Controls
        disabled={disablePrevious}
        label={previousTitle}
        onPressControl={onYearViewPrevious}
        styles={[styles.yearSelectorControl, styles.prev]}
        textStyles={[textStyle, previousTitleStyle]}
      />
      <Text style={[styles.yearSelectorHeaderText, textStyle]} {...accessibilityProps}>
        { title }
      </Text>
      <Controls
        disabled={disableNext}
        label={nextTitle}
        onPressControl={onYearViewNext}
        styles={[styles.yearSelectorControl, styles.next]}
        textStyles={[textStyle, nextTitleStyle]}
      />
    </View>
  );
}

YearsHeader.propTypes = {
  styles: PropTypes.shape(),
  textStyle: Text.propTypes.style,
  title: PropTypes.string,
  onYearViewNext: PropTypes.func,
  onYearViewPrevious: PropTypes.func,
};
