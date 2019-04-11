import React from 'react';
import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import Controls from './Controls';

export default function YearsViewHeader(props) {
  const {
    styles,
    textStyle,
    onYearViewPrevious,
    onYearViewNext
  } = props;

  return (
    <View style={styles.headerWrapper}>
      <Controls
        label={"Previous"}
        onPressControl={onYearViewPrevious}
        styles={[styles.yearSelector, styles.prev]}
        textStyles={textStyle}
      />
      <Text style={[styles.yearViewLabel, textStyle]}>
        Select Year
      </Text>
      <Controls
        label={"Next"}
        onPressControl={onYearViewNext}
        styles={[styles.yearSelector, styles.next]}
        textStyles={textStyle}
      />
    </View>
  );
}

YearsViewHeader.propTypes = {
  onYearViewNext: PropTypes.func,
  onYearViewPrevious: PropTypes.func
};
