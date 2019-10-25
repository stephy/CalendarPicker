import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

export default function Controls({
  styles,
  children,
  onPressControl,
  label,
  textStyles
}) {
  if (children) {
    return (
      <TouchableOpacity style={styles} onPress={() => onPressControl()}>
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={() => onPressControl()}>
      <Text style={[styles, textStyles]}>{label}</Text>
    </TouchableOpacity>
  );
}

Controls.propTypes = {
  styles: PropTypes.array.isRequired,
  children: PropTypes.any,
  onPressControl: PropTypes.func.isRequired,
  label: PropTypes.string
};

Controls.defaultProps = {
  children: null,
  label: ''
};
