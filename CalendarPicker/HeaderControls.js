import React from 'react';
import { View, Text } from 'react-native';
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
    months,
    previousTitle,
    nextTitle,
    textStyle,
    prevCustomStyle,
    nextCustomStyle,
    prevCustomChild,
    nextCustomChild
  } = props;
  const MONTHS = months ? months : Utils.MONTHS; // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const previous = previousTitle ? previousTitle : 'Previous';
  const next = nextTitle ? nextTitle : 'Next';
  const month = MONTHS[currentMonth];
  const year = currentYear;

  return (
    <View
      style={[
        styles.defaultWrapper,
        prevCustomChild && nextCustomChild ? styles.childrenWrapper : null
      ]}
    >
      {prevCustomChild ? (
        <Controls
          children={prevCustomChild}
          onPressControl={onPressPrevious}
          styles={[styles.prevChild, styles.monthSelector, prevCustomStyle]}
        />
      ) : (
        <Controls
          label={previous}
          onPressControl={onPressPrevious}
          styles={[styles.textSelector, styles.prevText]}
          textStyles={textStyle}
        />
      )}

      <View>
        <Text style={[styles.monthLabel, textStyle]}>
          {month} {year}
        </Text>
      </View>
      {nextCustomChild ? (
        <Controls
          children={nextCustomChild}
          onPressControl={onPressNext}
          styles={[styles.nextChild, styles.monthSelector, nextCustomStyle]}
        />
      ) : (
        <Controls
          label={next}
          onPressControl={onPressNext}
          styles={[styles.textSelector, styles.nextText]}
          textStyles={textStyle}
        />
      )}
    </View>
  );
}

HeaderControls.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
  prevCustomStyle: PropTypes.object,
  nextCustomStyle: PropTypes.object,
  prevCustomChild: PropTypes.any,
  nextCustomChild: PropTypes.any
};
HeaderControls.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  onPressNext: () => {},
  onPressPrevious: () => {},
  prevCustomStyle: {},
  nextCustomStyle: {},
  prevCustomChild: null,
  nextCustomChild: null
};
