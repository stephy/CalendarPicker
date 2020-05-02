import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Year from './Year';


export default function YearsGridView(props) {
  const {
    intialYear,
    styles,
    onSelectYear,
    textStyle,
    minDate,
    maxDate,
    disabledDates,
  } = props;
  const guideArray = [ 0, 1, 2, 3, 4 ];
  let currentYear = intialYear - 13; // center current year in grid

  function generateColumns() {
    const column = guideArray.map(() => {
      currentYear++;
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
        <View key={currentYear + index + ''} style={styles.yearsRow}>
          { generateColumns(index) }
        </View>
      ))
      }
    </View>
  );
}

YearsGridView.propTypes = {
  styles: PropTypes.shape(),
  intialYear: PropTypes.number.isRequired,
  onSelectYear: PropTypes.func,
  disabledDates: PropTypes.array
};
