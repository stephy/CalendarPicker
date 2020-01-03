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
    startFromMonday,
    weekdays,
    textStyle,
    dayLabelsWrapper,
    weekdayStyles,
  } = props;
  let wd = weekdays;
  if (!wd) {
    wd = startFromMonday? Utils.WEEKDAYS_MON : Utils.WEEKDAYS; // English Week days Array
  }

  return (
    <View style={[styles.dayLabelsWrapper, dayLabelsWrapper]}>
      { wd.map((day, key) => {
        let updatedStyle = textStyle;
        try {
          if (weekdayStyles.length > 0) {
            let currentDayStyle = weekdayStyles[+key];
            if (currentDayStyle) {
              updatedStyle = [updatedStyle, currentDayStyle];
            }
          }
        } catch (error) {
          console.log('Error while updating weekday style: ' + error);
        }

        console.log("DAY: " + day + " KEY: " + key);
          return (
            <Text key={key} style={[styles.dayLabels, updatedStyle]}>
              {day}
            </Text>
          );
        })
      }
    </View>
  );
}

Weekdays.propTypes = {};
