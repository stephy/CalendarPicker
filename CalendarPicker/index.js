import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { makeStyles } from './makeStyles';
import HeaderControls from './HeaderControls';

// The styles in makeStyles are intially scaled to this width
const IPHONE6_WIDTH = 375;
const initialScale = Dimensions.get('window').width / IPHONE6_WIDTH ;
const styles = StyleSheet.create(makeStyles(initialScale));

export default class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: new Date(),
    }
  }
  render() {
    const { initialDate } = this.state;
    return (
      <View>
        <HeaderControls styles={styles} initialDate={initialDate}/>
        <Text>Hello Calendar </Text>
      </View>
    );
  }
}
