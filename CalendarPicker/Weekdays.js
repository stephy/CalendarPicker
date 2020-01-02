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
    dayLabelsCustomWrapper,
    isChangeSundayColor,
    sundayColor,
  } = props;
  let wd = weekdays;
  if (!wd) {
    wd = startFromMonday? Utils.WEEKDAYS_MON : Utils.WEEKDAYS; // English Week days Array
  }

  return (
    <View style={[styles.dayLabelsWrapper, dayLabelsCustomWrapper]}>
      { wd.map((day, key) => {
        let updatedStyle = textStyle;
        if (isChangeSundayColor) {
          let matchIndex = 0;
          if (startFromMonday) {
            matchIndex = 6;
          }
          if (key === matchIndex) {
            updatedStyle = {...updatedStyle, ...{color: sundayColor}};
          }
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
