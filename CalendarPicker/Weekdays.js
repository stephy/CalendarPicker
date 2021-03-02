import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';

export default function Weekdays(props) {
  const {
    styles,
    firstDay,
    currentMonth: month,
    currentYear: year,
    weekdays,
    textStyle,
    dayLabelsWrapper,
    customDayHeaderStyles,
  } = props;

  // dayOfWeekNums: ISO week day numbers
  const dayOfWeekNums = Utils.getISOWeekdaysOrder(firstDay);
  let wd = weekdays;
  if (!wd) {
    wd = firstDay ? Utils.getWeekdays(firstDay) : Utils.WEEKDAYS; // English Week days Array
  }

  return (
    <View style={[styles.dayLabelsWrapper, dayLabelsWrapper]}>
      { wd.map((day, key) => {
        const dayOfWeekTextStyle = [styles.dayLabels, textStyle];
        let customDayOfWeekStyles = {};
        if (customDayHeaderStyles instanceof Function) {
          const dayOfWeek = dayOfWeekNums[key];
          customDayOfWeekStyles = customDayHeaderStyles({dayOfWeek, month, year}) || {};
          dayOfWeekTextStyle.push(customDayOfWeekStyles.textStyle);
        }
        return (
          <View style={customDayOfWeekStyles.style} key={key}>
            <Text style={dayOfWeekTextStyle}>
              {day}
            </Text>
          </View>
        );
      })
      }
    </View>
  );
}

Weekdays.propTypes = {
  firstDay: PropTypes.number,
  weekdays: PropTypes.array,
  customDayHeaderStyles: PropTypes.func,
};
