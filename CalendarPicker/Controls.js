import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default function Controls({ styles, textStyles, label, onPressControl, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => onPressControl()}
      disabled={disabled}
      hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
    >
      <Text style={[styles, textStyles]}>
        { disabled ? null : label }
      </Text>
    </TouchableOpacity>
  );
}

Controls.propTypes = {
  styles: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onPressControl: PropTypes.func.isRequired,
};
