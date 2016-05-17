/**
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

var CalendarPicker = require('./CalendarPicker/CalendarPicker'),
  CalendarPicker2;


CalendarPicker2 = React.createClass({
  getInitialState: function() {
    return {
      date: new Date()
    };
  },

  onDateChange: function(date) {
    this.setState({ date: date });
  },

  render: function() {
    return (
      <View style={styles.container}>

      <CalendarPicker
          selectedDate={this.state.date}
          onDateChange={this.onDateChange}
          screenWidth={Dimensions.width}
          weekdays = {['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']}
          months = {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
          nextTitle={'Next'}
          previousTitle={'Previous'}
          startFromMonday={true}
          selectedDayColor={'#E12518'}
          selectedDayTextColor={'#FFFFFF'}
                style={{}} />

        <Text style={styles.selectedDate}> Date: { this.state.date.toString() } </Text>
      </View>

    );
  }
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000'
  }
});

AppRegistry.registerComponent('CalendarPicker2', () => CalendarPicker2);
