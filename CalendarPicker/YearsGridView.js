import React from 'react';
import {
  View,
  Text,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Year from './Year';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default function YearsGridView(props) {
  const {
    year,
    styles,
    onSelectYear,
    textStyle,
    minDate,
    maxDate,
    disabledDates,
  } = props;
  const guideArray = [ 0, 1, 2, 3, 4 ];
  let currentYear = year

  function generateColumns(i) {
    const column = guideArray.map(index => {
      //don't subtract one for the year on the first one
      currentYear = i === 0 && index === 0 ? currentYear : currentYear - 1
      return (
        <Year
          key={currentYear}
          year={currentYear}
          styles={styles}
          onSelectYear={onSelectYear}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          textStyle={textStyle}
        />
      );
    });
    return column;
  }
  return (
    <View style={styles.yearsWrapper}>
      { guideArray.map(index => (
        <View key={index} style={styles.yearRow}>
          { generateColumns(index) }
        </View>
      ))
      }
    </View>
  );
}

YearsGridView.propTypes = {
  styles: PropTypes.shape(),
  year: PropTypes.number.isRequired,
  onSelectYear: PropTypes.func,
  disabledDates: PropTypes.array
}
