import React, { PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Utils } from './Utils';

export default function Day(props) {
  const { day, month, year, styles, onPressDay, selectedStartDate } = props;
  const thisDay = new Date(year, month, day);
  const today = new Date();
  let daySelectedStyle = {};

  if (Utils.compareDates(thisDay,today)) {
    daySelectedStyle = styles.selectedToday;
  }

  if (selectedStartDate && Utils.compareDates(thisDay,selectedStartDate)) {
    daySelectedStyle = styles.selectedDay;
  }

  return(
    <View style={styles.dayWrapper}>
      <View>
        <TouchableOpacity
          style={[styles.dayButton, daySelectedStyle]}
          onPress={() => onPressDay(day) }>
          <Text style={styles.dayLabel}>
            { day }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
}
