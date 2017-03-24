import React, { PropTypes } from 'react';
import {
  TouchableHighlight,
  Text,
} from 'react-native';

export default function Controls({ styles, label, onPressControl }) {
  return (
    <TouchableHighlight onPress={() => onPressControl()}>
      <Text style={styles}>
        { label }
      </Text>
    </TouchableHighlight>
  );
}

Controls.propTypes = {
  styles: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  onPressControl: PropTypes.func.isRequired,
};
