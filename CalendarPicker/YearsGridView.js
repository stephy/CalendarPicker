import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Year from './Year';


export default function YearsGridView(props) {
  const {
    intialYear,
    currentMonth,
    currentYear,
    styles,
    onSelectYear,
    textStyle,
    minDate,
    maxDate,
  } = props;
  const guideArray = [ 0, 1, 2, 3, 4 ];
  let year = intialYear - 13; // center current year in grid

  function generateColumns() {
    const column = guideArray.map(() => {
      year++;
      return (
        <Year
          key={year}
          year={year}
          currentMonth={currentMonth}
          currentYear={currentYear}
          styles={styles}
          onSelectYear={onSelectYear}
          minDate={minDate}
          maxDate={maxDate}
          textStyle={textStyle}
        />
      );
    });
    return column;
  }
  return (
    <View style={styles.yearsWrapper}>
      { guideArray.map(index => (
        <View key={year} style={styles.yearsRow}>
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
};
