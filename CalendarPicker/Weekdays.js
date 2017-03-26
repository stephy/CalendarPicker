import React, { PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Utils } from './Utils';

export default function Weekdays(props) {
  const { styles, startFromMonday } = props;
  const weekdays = startFromMonday? Utils.WEEKDAYS_MON : Utils.WEEKDAYS; // English Week days Array
  return (
    <View style={styles.dayLabelsWrapper}>
      { weekdays.map((day, key) => {
          return (
            <Text key={key} style={styles.dayLabels}>
              {day}
            </Text>
          );
        })
      }
    </View>
  );
}

Weekdays.propTypes = {};
