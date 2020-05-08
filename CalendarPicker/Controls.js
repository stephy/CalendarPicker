import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default function Controls(props) {
  const {
    styles,
    textStyles,
    label,
    component,
    onPressControl,
    disabled,
  } = props;

  return (
    <TouchableOpacity
      onPress={() => onPressControl()}
      style={styles}
      disabled={disabled}
      hitSlop={{ top: 20, bottom: 20, left: 40, right: 40 }}
    >
      { component ?
        ( disabled ? null : component )
        :
        <Text style={[textStyles]}>
          { disabled ? null : label }
        </Text>
      }
    </TouchableOpacity>
  );
}

Controls.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  onPressControl: PropTypes.func.isRequired,
};
