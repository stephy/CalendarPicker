import React, { PropTypes } from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';

export default function Controls({ styles, label, onPressControl }) {
  return (
    <TouchableOpacity
      onPress={() => onPressControl()}
    >
      <Text style={styles}>
        { label }
      </Text>
    </TouchableOpacity>
  );
}

Controls.propTypes = {
  styles: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  onPressControl: PropTypes.func.isRequired,
};
