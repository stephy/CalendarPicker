import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

export default function Day(props) {
  const { styles } = props;
  return(
    <View style={styles.dayWrapper}>
      <View style={styles.dayButton}>
        <TouchableOpacity
          style={styles.dayButton}
        >
          <Text style={styles.dayLabel}>
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
