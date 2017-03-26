import React, { PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Utils } from './Utils';
import Controls from './Controls';

export default function HeaderControls(props) {
  const { styles, initialDate, currentMonth, currentYear, onPressNext, onPressPrevious } = props;
  const MONTHS = Utils.MONTHS; // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const month = MONTHS[currentMonth];
  const year = currentYear;
  console.log('STYLES: ', styles);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.monthSelector}>
        <Controls
          label="Previous"
          onPressControl={onPressPrevious}
          styles={styles.prev}
        />
      </View>
      <View>
        <Text style={[styles.monthLabel]}>
           { month } { year }
        </Text>
      </View>
      <View style={styles.monthSelector}>
        <Controls
          label="Next"
          onPressControl={onPressNext}
          styles={styles.next}
        />
      </View>
    </View>
  );
}

HeaderControls.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
};
