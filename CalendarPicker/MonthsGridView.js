import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Month from './Month';


export default function MonthsGridView(props) {
  const {
    currentYear,
    months,
    styles,
    onSelectMonth,
    textStyle,
    minDate,
    maxDate,
  } = props;
  const _months = Array.from(Array(12).keys());
  const columnArray = [ 0, 1, 2 ];
  const rowArray = [ 0, 1, 2, 3 ];

  function generateColumns() {
    const column = columnArray.map(index => {
      const currentMonth = _months.shift();
      return (
        <Month
          key={currentMonth + index}
          currentMonth={currentMonth}
          currentYear={currentYear}
          months={months}
          styles={styles}
          onSelectMonth={onSelectMonth}
          minDate={minDate}
          maxDate={maxDate}
          textStyle={textStyle}
        />
      );
    });
    return column;
  }

  return (
    <View style={styles.monthsWrapper}>
      { rowArray.map(index => (
        <View key={index} style={styles.monthsRow}>
          { generateColumns() }
        </View>
      ))
      }
    </View>
  );
}

MonthsGridView.propTypes = {
  styles: PropTypes.shape(),
  currentYear: PropTypes.number.isRequired,
  months: PropTypes.array,
  onSelectMonth: PropTypes.func,
};
