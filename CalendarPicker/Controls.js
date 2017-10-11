import React from 'react'; 
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
} from 'react-native';

export default function Controls({ styles, textStyles, label, onPressControl }) {
  return (
    <TouchableOpacity
      onPress={() => onPressControl()}
    >
      <Text style={[styles, textStyles]}>
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
