import React, { PropTypes } from "react";
import { View, Text } from "react-native";
import { Utils } from "./Utils";

export default function Weekdays(props) {
  const {
    styles,
    startFromMonday,
    weekdays,
    textStyle,
    weekDaysTextStyle,
    weekDaysStyle
  } = props;
  let wd = weekdays;
  if (!wd) {
    wd = startFromMonday ? Utils.WEEKDAYS_MON : Utils.WEEKDAYS; // English Week days Array
  }

  return (
    <View style={[styles.dayLabelsWrapper, weekDaysStyle]}>
      {wd.map((day, key) => {
        return (
          <Text
            key={key}
            style={[styles.dayLabels, textStyle, weekDaysTextStyle]}
          >
            {day}
          </Text>
        );
      })}
    </View>
  );
}

Weekdays.propTypes = {};
