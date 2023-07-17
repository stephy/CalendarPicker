import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import { locale } from 'moment';

export default function Weekdays(props) {
  const {
    styles,
    startFromMonday,
    currentMonth: month,
    currentYear: year,
    weekdays,
    textStyle,
    dayLabelsWrapper,
    customDayHeaderStyles,
    dayOfWeekStyles, // ToDo: Deprecated. Remove.
    lang
  } = props;

  // dayOfWeekNums: ISO week day numbers
  const dayOfWeekNums = startFromMonday ? [1, 2, 3, 4, 5, 6, 7] : [7, 1, 2, 3, 4, 5, 6];
  let wd = weekdays;
  console.log(wd)
  const isArabic = (lang == 'ar')
  if (!wd) {
    if (isArabic) {
      wd = startFromMonday ? Utils.ARABIC_WEEKDAYS_MON : Utils.ARABIC_WEEKDAYS

    } else {
      wd = startFromMonday ? Utils.WEEKDAYS_MON : Utils.WEEKDAYS

    }
  }

  return (
    <View style={[styles.dayLabelsWrapper, dayLabelsWrapper]}>
      {wd.map((day, key) => {
        const dayOfWeekTextStyle = [styles.dayLabels, textStyle];
        let customDayOfWeekStyles = {};
        if (customDayHeaderStyles instanceof Function) {
          const dayOfWeek = dayOfWeekNums[key];
          customDayOfWeekStyles = customDayHeaderStyles({ dayOfWeek, month, year }) || {};
          dayOfWeekTextStyle.push(customDayOfWeekStyles.textStyle);
        }
        // ----------------------------------------------------------------
        // ToDo: Deprecated. Remove
        else {
          try {
            if (dayOfWeekStyles[+key]) {
              console.warn('CalendarPicker: dayOfWeekStyles is deprecated. Use customDatesStyles / customDayHeaderStyles callbacks instead.');
              let currentDayStyle = dayOfWeekStyles[+key];
              if (currentDayStyle) {
                dayOfWeekTextStyle.push(currentDayStyle);
              }
            }
          } catch (error) {
            console.log('Error while updating weekday style: ' + error);
          }
        }
        // ----------------------------------------------------------------

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
  startFromMonday: PropTypes.bool,
  weekdays: PropTypes.array,
  customDayHeaderStyles: PropTypes.func,
};
