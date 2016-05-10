/**
 * CalendarPicker Version 2.0
 *
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var CalendarPicker = require('./CalendarPicker/CalendarPicker'),
    Dimensions = require('Dimensions').get('window'),
    CalendarPicker2;


CalendarPicker2 = React.createClass({
  getInitialState: function() {
    return {
      date: new Date(),
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
          selectedBackgroundColor={'#5ce600'} />

        <Text style={styles.selectedDate}>Date:  { this.state.date.toString() } </Text>
      </View>

    );
  }
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
});

AppRegistry.registerComponent('CalendarPicker2', () => CalendarPicker2);
