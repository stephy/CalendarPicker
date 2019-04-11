import React from 'react';
import uuid from 'uuid/v4';
import {
  View,
  Text,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Month from './Month';
import { Utils } from './Utils';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default function MonthsGridView(props) {
  const {
    year,
    styles,
    onSelectMonth,
    textStyle,
    minDate,
    maxDate,
    disabledDates,
  } = props;
  const months = Array.from(Array(12).keys());
  const columnArray = [ 0, 1, 2 ];
  const rowArray = [ 0, 1, 2, 3 ];

  function generateColumns(i) {
    const column = columnArray.map(index => {
      const month = months.shift();
      return (
        <Month
          key={month}
          month={month}
          year={year}
          styles={styles}
          onSelectMonth={onSelectMonth}
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
    <View style={styles.monthsWrapper}>
      { rowArray.map(index => (
        <View key={index} style={styles.monthRow}>
          { generateColumns(index) }
        </View>
      ))
      }
    </View>
  );
}

MonthsGridView.propTypes = {
  styles: PropTypes.shape(),
  year: PropTypes.number.isRequired,
  onSelectMonth: PropTypes.func,
  disabledDates: PropTypes.array,
}
